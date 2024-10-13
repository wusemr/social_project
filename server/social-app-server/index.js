const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');   // 비밀번호 암호화
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const port = 3000;

// PostgreSql 연결 설정
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// JSON 데이터 파싱을 위한 미들웨어
app.use(express.json());

// 이미지 파일을 서빙하는 라우터
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// users 테이블에서 userid를 가진 사용자의 시리얼 id를 조회하는 함수
const getIdByUserid = async (userid) => {
    try {
        const result = await pool.query(
            'SELECT id FROM users WHERE userid = $1',
            [userid]
        );

        if (result.rowCount === 0) {
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        return result.rows[0].id;
    } catch (error) {
        throw new Error('사용자 ID를 조회하는 중 오류가 발생했습니다.', error);
    }
}

// 아이디 중복 체크 API
app.post('/auth/check-id', async (req, res) => {
    const { userid } = req.body;

    try {
        const result = await pool.query(
            'SELECT userid FROM users WHERE userid = $1',
            [userid]
        );
        if (result.rows.length > 0) {
            // return res.status(400).json({ message: '이미 사용 중인 아이디입니다.' });
            return res.status(200).json({ available: false });
        }

        // return res.status(200).json({ message: '사용 가능한 아이디입니다.' });
        return res.status(200).json({ available: true });
    } catch (error) {
        // return res.status(500).json({ message: '서버 오류입니다. 다시 시도해주세요.' });
        return res.status(500).json({ available: false, message: '서버 오류입니다. 다시 시도해주세요' });
    }
});

// 회원가입 API
app.post('/auth/signup', async (req, res) => {
    const { username, userid, password } = req.body;

    if (!username || !userid || !password) {
        return res.status(400).json({ message: '모든 정보를 입력해주세요.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (username, userid, password_hash) VALUES ($1, $2, $3)',
            [username, userid, hashedPassword]
        );

        return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다. 다시 시도해주세요.' });
    }
});

// 로그인 API
app.post('/auth/login', async (req, res) => {
    const { userid, password } = req.body;

    if (!userid || !password) {
        return res.status(400).json({ message: '아이디와 비밀번호를 모두 입력해주세요.' });
    }

    try {
        const result = await pool.query(
            'SELECT userid, password_hash FROM users WHERE userid = $1',
            [userid]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: '존재하지 않는 아이디입니다.' });
        }

        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        return res.status(200).json({ message: '로그인 성공', userid: user.userid });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다. 다시 시도해주세요.' });
    }
});

// 회원 정보 조회 API
app.post('/user/get-info', async (req, res) => {
    const { userid } = req.body;

    if (!userid) {
        return res.status(400).json({ message: '정보 조회를 위해 아이디를 제공해 주세요.' });
    }

    try {
        const result = await pool.query(
            'SELECT username, userid, profile_picture, followers_count, following_count, posts_count FROM users WHERE userid = $1',
            [userid]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const user = result.rows[0];
        console.log(`[회원정보조회] ${userid} 님의 정보\n`, user);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 특정 게시물 조회 API
app.get('/post/get-one', async (req, res) => {
    const { currentUser, postid } = req.query;

    try {
        const currentId = await getIdByUserid(currentUser);

        const postResult = await pool.query(
            `
            SELECT
                p.id AS post_id, p.content, p.created_at,
                u.userid, u.username, u.profile_picture,
                ARRAY_AGG(DISTINCT pi.image_url) AS images,
                COUNT(DISTINCT c.id) AS comment_count,
                COUNT(DISTINCT l.id) AS like_count,
                EXISTS (
                    SELECT 1 FROM likes
                    WHERE likes.post_id = p.id
                    AND likes.user_id = $1
                ) AS is_liked
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN postimage pi ON p.id = pi.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            LEFT JOIN likes l ON p.id = l.post_id
            WHERE p.id = $2
            GROUP BY p.id, u.userid, u.username, u.profile_picture, p.created_at
            `, [currentId, postid]
        );

        if (postResult.rows.length === 0) {
            return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
        }

        const post = postResult.rows[0];
        console.log('알림에 해당하는 게시물이 뭐냐면', post);

        res.status(200).json({
            post_id: post.post_id,
            content: post.content,
            created_at: post.created_at,
            userid: post.userid,
            username: post.username,
            profile_picture: post.profile_picture,
            images: post.images.filter(url => url),
            isLiked: post.is_liked,
            commentCount: post.comment_count,
            likeCount: post.like_count,
        });
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 특정 회원 게시물 조회 API
app.get('/post/get-user', async (req, res) => {
    const { userid } = req.query;

    if (!userid) {
        return res.status(400).json({ message: '아이디를 제공해 주세요.' });
    }

    try {
        const userResult = await pool.query(
            'SELECT id FROM users WHERE userid = $1',
            [userid]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const id = userResult.rows[0].id;

        const postsResult = await pool.query(`
            SELECT
                p.id AS post_id,
                p.content,
                COALESCE(pi.image_url, '') AS first_image_url
            FROM posts p
            LEFT JOIN (
                SELECT post_id, image_url
                FROM postimage
                WHERE id IN (
                    SELECT MIN(id)
                    FROM postimage
                    GROUP BY post_id
                )
            ) pi ON p.id = pi.post_id
            WHERE p.user_id = $1
            ORDER BY p.created_at DESC
        `, [id]);

        console.log(`[게시물조회] ${userid} 님의 게시물 \n`, postsResult.rows);
        return res.status(200).json(postsResult.rows);
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 게시물 업로드 API
app.post('/post/upload', upload.array('photos', 10), async (req, res) => {
    const { content, userid } = req.body;

    const photoPaths = req.files.map(file => file.path);

    if (photoPaths.length === 0 || !userid) {
        return res.status(400).json({ message: '업로드할 사진 또는 사용자 ID가 필요합니다.' });
    }

    try {
        const userResult = await pool.query(
            'SELECT id FROM users WHERE userid = $1',
            [userid]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const user_id = userResult.rows[0].id;

        // 게시물 생성 Query
        const postResult = await pool.query(
            'INSERT INTO posts (user_id, content, created_at) VALUES ($1, $2, NOW()) RETURNING id',
            [user_id, content]
        );
        const post_id = postResult.rows[0].id;

        // 게시물 이미지 저장 Query
        const imagePromises = req.files.map(file => {
            return pool.query(
                'INSERT INTO postimage (post_id, image_url) VALUES ($1, $2)',
                [post_id, file.path]
            );
        })
        await Promise.all(imagePromises);

        await pool.query(
            'UPDATE users SET posts_count = posts_count + 1 WHERE id = $1',
            [user_id]
        );

        return res.status(201).json({ message: '게시물이 업로드되었습니다.', post_id });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 프로필 사진 업데이트 API
app.post('/user/update-profile/photo', upload.single('photo'), async (req, res) => {
    const { userid } = req.body;

    if (!req.file || !userid) {
        return res.status(400).json({ message: '사진 또는 사용자 ID가 필요합니다.' });
    }

    const profilePhotoUrl = req.file.path;

    try {
        const result = await pool.query(
            'UPDATE users SET profile_picture = $1 WHERE userid = $2',
            [profilePhotoUrl, userid]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        res.status(200).json({ message: '프로필 사진이 업데이트 되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 프로필 사진 삭제 API
app.post('/user/delete-profile/photo', async (req, res) => {
    const { userid } = req.body;

    if (!userid) {
        return res.status(400).json({ message: '사용자 ID가 필요합니다.' });
    }

    try {
        const { rows } = await pool.query(
            'SELECT profile_picture FROM users WHERE userid = $1',
            [userid]);

        if (rows.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const profilePhotoUrl = rows[0].profile_picture;
        const result = await pool.query(
            'UPDATE users SET profile_picture = NULL WHERE userid = $1',
            [userid]
        );

        res.status(200).json({ message: '프로필 사진이 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 프로필 사진 조회 API
app.get('/user/get-profile/photo', async (req, res) => {
    const { userid } = req.query;

    if (!userid) {
        return res.status(400).json({ message: '사용자 Id가 필요합니다.' });
    }

    try {
        const { rows } = await pool.query(
            'SELECT profile_picture FROM users WHERE userid = $1',
            [userid]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const profilePhotoUrl = rows[0].profile_picture;

        res.status(200).json({ profile_picture: profilePhotoUrl });
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
})

// 사용자 검색 API
app.get('/user/search', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: '검색어가 필요합니다.' });
    }

    try {
        const result = await pool.query(
            'SELECT userid, username, profile_picture FROM users WHERE username ILIKE $1 OR userid ILIKE $1',
            [`%${query}%`]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 팔로우 여부 확인 API
app.post('/user/check-following', async (req, res) => {
    const { userid, following_id } = req.body;

    if (!userid || !following_id) {
        return res.status(400).json({ message: '사용자 ID와 팔로우 여부를 확인할 사용자 ID가 필요합니다.' });
    }

    try {
        const currentUser = await getIdByUserid(userid);
        const followingUser = await getIdByUserid(following_id);

        const result = await pool.query(
            'SELECT * FROM following WHERE user_id = $1 AND following_id = $2',
            [currentUser, followingUser]
        );
        console.log('결과', result.rows);
        const isFollowing = result.rowCount > 0;
        res.status(200).json({ isFollowing });
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 팔로우 API
app.post('/user/follow', async (req, res) => {
    const { userid, following_id } = req.body;

    if (!userid || !following_id) {
        return res.status(400).json({ message: '사용자 ID와 팔로우할 사용자 ID가 필요합니다.' });
    }

    try {
        const currentUser = await getIdByUserid(userid);
        const followingUser = await getIdByUserid(following_id);

        // following 테이블에 팔로잉 추가
        await pool.query(
            'INSERT INTO following (user_id, following_id, created_at) VALUES ($1, $2, NOW())',
            [currentUser, followingUser]
        );
        console.log('팔로잉 추가 성공');

        // followers 테이블에 팔로워 추가
        await pool.query(
            'INSERT INTO followers (user_id, follower_id, created_at) VALUES ($1, $2, NOW())',
            [followingUser, currentUser]
        );
        console.log('팔로워 추가 성공');

        // users 테이블의 팔로워 수 업데이트
        await pool.query(
            'UPDATE users SET followers_count = followers_count + 1 WHERE id = $1',
            [followingUser]
        );
        console.log('팔로워 수 업데이트');

        // users 테이블의 팔로잉 수 업데이트
        await pool.query(
            'UPDATE users SET following_count = following_count + 1 WHERE id = $1',
            [currentUser]
        );
        console.log('팔로잉 수 업데이트');

        // 알림 생성
        await pool.query(
            'INSERT INTO notifications (user_id, actor_id, type, sub_type, message, is_read, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
            [followingUser, currentUser, 'follow', 'profile', '님이 회원님을 팔로우했습니다.', false]
        );
        console.log('알림 생성 성공')

        res.status(200).json({ message: '팔로우 성공' });
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 팔로우 취소 API
app.post('/user/unfollow', async (req, res) => {
    const { userid, following_id } = req.body;

    if (!userid || !following_id) {
        return res.status(400).json({ message: '사용자 ID와 팔로우를 취소할 사용자 ID가 필요합니다.' });
    }

    try {
        const currentUser = await getIdByUserid(userid);
        const followingUser = await getIdByUserid(following_id);

        // following 테이블에서 팔로잉 삭제
        await pool.query(
            'DELETE FROM following WHERE user_id = $1 AND following_id = $2',
            [currentUser, followingUser]
        );
        console.log('팔로잉 삭제 성공');

        // followers 테이블에서 팔로워 삭제
        await pool.query(
            'DELETE FROM followers WHERE user_id = $1 AND follower_id = $2',
            [followingUser, currentUser]
        );
        console.log('팔로워 삭제 성공');

        // users 테이블의 팔로워 수 업데이트
        await pool.query(
            'UPDATE users SET followers_count = followers_count - 1 WHERE id = $1',
            [followingUser]
        );
        console.log('팔로워 수 업데이트');

        // users 테이블의 팔로잉 수 업데이트
        await pool.query(
            'UPDATE users SET following_count = following_count - 1 WHERE id = $1',
            [currentUser]
        );
        console.log('팔로잉 수 업데이트');

        res.status(200).json({ message: '팔로우 취소 성공' });
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 팔로잉 목록 조회 API
app.get('/user/get-list/following', async (req, res) => {
    const { currentUser, targetUser } = req.query;
    console.log('난', currentUser, '이고,', targetUser, '이사람의 팔로잉 목록을 보고싶어');

    if (!currentUser || !targetUser) {
        return res.status(400).json({ message: '사용자 ID가 필요합니다.' });
    }

    try {
        const currentId = await getIdByUserid(currentUser);
        const targetId = await getIdByUserid(targetUser);
        console.log(`${currentId}번 ${currentUser} 님이 ${targetId}번 ${targetUser} 님의 팔로잉 목록 조회를 시도하였습니다.`);

        // 현재 보고있는 사용자(targetUser)가 팔로잉 중인 사용자의 목록 불러오기
        const followingResult = await pool.query(
            `
            SELECT u.id, u.userid, u.username, u.profile_picture
            FROM following f
            JOIN users u ON f.following_id = u.id
            WHERE f.user_id = $1
            `, [targetId]
        );

        const followingList = followingResult.rows;

        // 팔로잉 목록 중 현재 로그인한 사용자(currentUser)가 팔로우 중인지 여부를 확인
        for (const user of followingList) {
            const isFollowingResult = await pool.query(
                'SELECT 1 FROM following WHERE user_id = $1 AND following_id = $2',
                [currentId, user.id]
            );
            user.isFollowing = isFollowingResult.rows.length > 0;
            console.log(`현재 사용자(${currentUser})가 ${user.userid}를 팔로우 중인가? ${user.isFollowing}`);
        }

        console.log('팔로잉 리스트 나간다', followingList);
        return res.status(200).json(followingList);
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 팔로워 목록 조회 API
app.get('/user/get-list/follower', async (req, res) => {
    const { currentUser, targetUser } = req.query;
    console.log('난', currentUser, '이고,', targetUser, '이사람의 팔로워 목록을 보고싶어');

    if (!currentUser || !targetUser) {
        return res.status(400).json({ message: '사용자 ID가 필요합니다.' });
    }

    try {
        const currentId = await getIdByUserid(currentUser);
        const targetId = await getIdByUserid(targetUser);
        console.log(`${currentId}번 ${currentUser} 님이 ${targetId}번 ${targetUser} 님의 팔로워 목록 조회를 시도하였습니다.`);

        // 현재 보고있는 사용자(targetUser)가 팔로잉 중인 사용자의 목록 불러오기
        const followerResult = await pool.query(
            `
            SELECT u.id, u.userid, u.username, u.profile_picture
            FROM followers f
            JOIN users u ON f.follower_id = u.id
            WHERE f.user_id = $1
            `, [targetId]
        );

        const followerList = followerResult.rows;

        // 팔로워 목록 중 현재 로그인한 사용자(currentUser)가 팔로우 중인지 여부를 확인
        for (const user of followerList) {
            const isFollowingResult = await pool.query(
                'SELECT 1 FROM following WHERE user_id = $1 AND following_id = $2',
                [currentId, user.id]
            );
            user.isFollowing = isFollowingResult.rows.length > 0;
            console.log(`현재 사용자(${currentUser})가 ${user.userid}를 팔로우 중인가? ${user.isFollowing}`);
        }

        console.log('팔로워 리스트 나간다', followerList);
        return res.status(200).json(followerList);
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 팔로우 중인 사용자의 게시물 조회 API
app.get('/post/get-following', async (req, res) => {
    const { currentUser } = req.query;
    console.log('현재 로그인한 ㄱ계정:', currentUser);

    if (!currentUser) {
        return res.status(400).json({ message: '사용자 ID가 필요합니다.' });
    }

    try {
        const currentId = await getIdByUserid(currentUser);
        console.log(`${currentUser} 님의 시리얼아이디는 ${currentId} 입니다`);

        const postsResult = await pool.query(
            `
            SELECT
                p.id AS post_id, p.content,
                u.userid, u.username, u.profile_picture,
                pi.image_url,
                COUNT(DISTINCT c.id) AS comment_count,
                COUNT(DISTINCT l.id) AS like_count,
                p.created_at,
                EXISTS (
                    SELECT 1 FROM likes
                    WHERE likes.post_id = p.id
                    AND likes.user_id = $1
                ) AS is_liked
            FROM posts p
            JOIN users u ON p.user_id = u.id
            JOIN following f ON f.following_id = p.user_id
            LEFT JOIN postimage pi ON pi.post_id = p.id
            LEFT JOIN comments c ON c.post_id = p.id
            LEFT JOIN likes l ON l.post_id = p.id
            WHERE f.user_id = $1
            GROUP BY p.id, u.userid, u.username, u.profile_picture, pi.image_url, p.created_at
            ORDER BY p.created_at DESC
            `, [currentId]
        );

        const posts = postsResult.rows.reduce((acc, row) => {
            const post = acc.find(p => p.post_id === row.post_id);

            if (post) {
                post.images.push(row.image_url);
            } else {
                acc.push({
                    post_id: row.post_id,
                    content: row.content,
                    like_count: row.like_count,
                    comment_count: row.comment_count,
                    created_at: row.created_at,
                    userid: row.userid,
                    username: row.username,
                    profile_picture: row.profile_picture,
                    images: row.image_url ? [row.image_url] : [],
                    isLiked: row.is_liked
                });
            }

            return acc;
        }, []);
        console.log('post목록이요', posts);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 좋아요 처리 API
app.post('/post/like', async (req, res) => {
    const { userId, postId } = req.body;
    console.log(`나는 ${userId}, 포스트는 ${postId}`);
    try {
        const user_id = await getIdByUserid(userId);
        // 게시물의 사용자 ID 불러오기
        const post = await pool.query(
            'SELECT user_id FROM posts WHERE id = $1',
            [postId]
        );
        const postOwnerId = post.rows[0]?.user_id;
        console.log('이 게시물 오너는', postOwnerId, '입니다');

        // 좋아요 상태 확인
        const existingLike = await pool.query(
            'SELECT * FROM likes WHERE user_id = $1 AND post_id = $2',
            [user_id, postId]
        );

        // 이미 좋아요한 경우 -> 좋아요 취소
        if (existingLike.rows.length > 0) {
            await pool.query(
                'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
                [user_id, postId]
            );

            console.log('좋아요 취소 성공!');
            return res.json({ success: true, liked: false });
        } else {
            await pool.query(
                'INSERT INTO likes (user_id, post_id) VALUES ($1, $2)',
                [user_id, postId]
            );

            if (postOwnerId && postOwnerId !== user_id) {
                const message = '님이 회원님의 게시물을 좋아합니다.';
                await pool.query(
                    'INSERT INTO notifications (user_id, actor_id, type, sub_type, message, post_id, is_read, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
                    [postOwnerId, user_id, 'like', 'post', message, postId, false]
                );
            }
            console.log('좋아요 성공!')
            return res.json({ success: true, liked: true });
        }
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 좋아요한 사용자 목록 조회 API
app.get('/user/get-list/like', async (req, res) => {
    const { currentUser, postId } = req.query;

    if (!currentUser || !postId) {
        return res.status(400).json({ message: '로그인한 사용자와 게시물 아이디가 필요합니다.' });
    }

    try {
        const currentId = await getIdByUserid(currentUser);
        console.log('현재 로그인한 사용자의 시리얼아이디는:', currentId);

        const likedUsers = await pool.query(
            `
            SELECT
                u.id,
                u.userid,
                u.username,
                u.profile_picture,
                CASE
                    WHEN f.follower_id IS NOT NULL THEN true
                    ELSE false
                END AS is_following
            FROM likes l
            JOIN users u ON l.user_id = u.id
            LEFT JOIN followers f ON f.follower_id = $1 AND f.user_id = u.id
            WHERE l.post_id = $2
            `, [currentId, postId]
        );

        console.log('좋아요 누른 사용자 목록은\n', likedUsers.rows);
        res.json(likedUsers.rows);
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 알림 목록 조회 API
app.get('/notification/get-list', async (req, res) => {
    const { userId } = req.query;
    console.log('userid는', userId);
    try {
        const user_id = await getIdByUserid(userId);
        const notificationsResult = await pool.query(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
            [user_id]
        );
        const notifications = notificationsResult.rows;
        console.log('알림들이다', notifications);

        const actorIds = [...new Set(notifications.map(n => n.actor_id))];
        const actorResult = await pool.query(
            'SELECT id, username, userid, profile_picture FROM users WHERE id = ANY($1::int[])',
            [actorIds]
        );
        const actors = actorResult.rows.reduce((acc, actor) => {
            acc[actor.id] = actor;
            return acc;
        }, {});
        console.log('액터들이다', actors);

        const response = notifications.map(notification => {
            const actor = actors[notification.actor_id] || {};
            return {
                id: notification.id,
                actor_id: actor.id,
                actor_userid: actor.userid,
                actor_username: actor.username,
                actor_profile_picture: actor.profile_picture,
                message: notification.message,
                time: notification.created_at,
                post_id: notification.post_id,
                comment_id: notification.comment_id,
                type: notification.type,
                sub_type: notification.sub_type,
                is_read: notification.is_read
            };
        });
        console.log('보낼 결과물이다', response);

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 댓글 작성 API
app.post('/comment/add-comment', async (req, res) => {
    const { userId, postId, content } = req.body;
    console.log(`댓글 작성자: ${userId}, 게시물: ${postId}, 내용: ${content}`);

    try {
        const user_id = await getIdByUserid(userId);

        const commentResult = await pool.query(
            'INSERT INTO comments (post_id, user_id, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [postId, user_id, content]
        );
        const newComment = commentResult.rows[0];
        console.log('새로운 댓글을 생성했습니다', newComment);

        const post = await pool.query(
            'SELECT user_id FROM posts WHERE id = $1',
            [postId]
        );
        const postOwnerId = post.rows[0]?.user_id;
        console.log('게시물 당사자는 누구게', postOwnerId);

        if (postOwnerId && postOwnerId !== user_id) {
            const message = '님이 회원님의 게시물에 댓글을 남겼습니다.';
            await pool.query(
                'INSERT INTO notifications (user_id, actor_id, type, sub_type, message, post_id, is_read, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
                [postOwnerId, user_id, 'comment', 'post', message, postId, false]
            );
        }

        console.log('댓글 작성 및 알림 생성 성공');
        return res.json({ success: true, comment: newComment });
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 게시물 댓글 조회 API
app.get('/comment/get-comments', async (req, res) => {
    const { postId, userId } = req.query;
    console.log(`게시물 ${postId}의 댓글 불러오기`);

    try {
        const user_id = await getIdByUserid(userId);

        const comments = await pool.query(
            `SELECT comments.*,
                    users.userid,
                    users.profile_picture,
                    EXISTS(SELECT 1 FROM comment_likes WHERE comment_likes.comment_id =comments.id AND comment_likes.user_id = $2) AS liked
            FROM comments
            JOIN users ON comments.user_id = users.id
            WHERE post_id = $1
            ORDER BY created_at ASC`,
            [postId, user_id]
        );

        console.log('댓글 불러오기 성공!');
        return res.json({ success: true, comments: comments.rows });
    } catch (error) {
        console.error('댓글 불러오기 중 오류:', error);
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 댓글 좋아요 추가 API
app.post('/comment/like', async (req, res) => {
    const { userId, commentId } = req.body;

    try {
        const user_id = await getIdByUserid(userId);
        console.log('userId:', userId, 'user_id:', user_id, 'commentId:', commentId);

        const comment = await pool.query(
            'SELECT user_id FROM comments WHERE id = $1',
            [commentId]
        );
        const commentOwnerId = comment.rows[0]?.user_id;
        console.log('댓글 작성자는', commentOwnerId);

        const existingLike = await pool.query(
            'SELECT * FROM comment_likes WHERE user_id = $1 AND comment_id = $2',
            [user_id, commentId]
        );

        if (existingLike.rows.length > 0) {
            // 좋아요 취소
            await pool.query(
                'DELETE FROM comment_likes WHERE user_id = $1 AND comment_id = $2',
                [user_id, commentId]
            );

            await pool.query(
                'UPDATE comments SET like_count = like_count - 1 WHERE id = $1',
                [commentId]
            );

            return res.json({ success: true, liked: false });
        } else {
            // 좋아요 추가
            await pool.query(
                'INSERT INTO comment_likes (user_id, comment_id) VALUES ($1, $2)',
                [user_id, commentId]
            );

            await pool.query(
                'UPDATE comments SET like_count = like_count + 1 WHERE id = $1',
                [commentId]
            );

            // 알림 추가
            if (commentOwnerId && commentOwnerId !== user_id) {
                const message = '님이 회원님의 댓글에 좋아요를 눌렀습니다.';
                await pool.query(
                    'INSERT INTO notifications (user_id, actor_id, type, sub_type, message, comment_id, is_read, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
                    [commentOwnerId, user_id, 'like', 'comment', message, commentId, false]
                );
            }
            return res.json({ success: true, liked: true });
        }
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 답글 추가 API
/*
app.post('/comment/reply', async (req, res) => {
    const { userId, commentId, content } = req.body;

    try {
        const user_id = await getIdByUserid(userId);

        // 댓글 작성
        const replyResult = await pool.query(
            'INSERT INTO replies (comment_id, user_id, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [commentId, user_id, content]
        );
        const newReply = replyResult.rows[0];

        // 댓글 작성자에게 알림 추가
        const comment = await pool.query(
            'SELECT user_id FROM comments WHERE id = $1',
            [commentId]
        );
        const commentOwnerId = comment.rows[0]?.user_id;

        if (commentOwnerId && commentOwnerId !== user_id) {
            const message = '님이 회원님의 댓글에 답글을 남겼습니다.';
            await pool.query(
                'INSERT INTO notifications (user_id, actor_id, type, sub_type, message, comment_id, is_read, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
                [commentOwnerId, user_id, 'reply', 'comment', message, commentId, false]
            );
        }

        return res.json({ success: true, reply: newReply });
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});
*/

// 알림 읽음 처리 API
app.post('/notification/mark-as-read', async (req, res) => {
    const { notificationIds } = req.body;

    try {
        if (!notificationIds || notificationIds.length === 0) {
            return res.status(400).json({ message: '알림 ID가 없습니다.' });
        }

        await pool.query(
            'UPDATE notifications SET is_read = true WHERE id = ANY($1)',
            [notificationIds]
        );

        res.json({ success: true, message: '알림이 읽음 처리 되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다. 다시 시도해 주세요.' });
    }
});

// 메시지 전송 및 저장 API
app.post('/chat/send-message', async (req, res) => {
    const { chat_id, sender_id, message_text } = req.body;

    try {
        const sender = await getIdByUserid(sender_id);

        const result = await pool.query(
            'INSERT INTO messages (chat_id, sender_id, message_text) VALUES ($1, $2, $3) RETURNING *',
            [chat_id, sender, message_text]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: '메시지 전송 실패' });
    }
});

// 특정 채팅방의 메시지 조회 API
app.get('/chat/get-message/:chat_id', async (req, res) => {
    const { chat_id } = req.params;
    console.log('조회시도하려는 채팅방 아이디 이거임', chat_id);

    try {
        const result = await pool.query(
            'SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC',
            [chat_id]
        );
        console.log('메시지내역:', result.rows);
        if (result.rows.length === 0) {
            return res.json([]);
        }

        res.json(result.rows);
    } catch (error) {
        console.error('메시지메싲메싲', error);
        res.status(500).json({ message: '메시지 가져오기 실패' });
    }
});

// 특정 사용자의 전체 채팅방 조회 API
app.get('/chat/get-list/:user_id', async (req, res) => {
    const { user_id } = req.params;
    console.log(user_id);
    try {
        if (!user_id) {
            return res.status(400).json({ message: '사용자 ID가 필요합니다.' });
        }

        const userid = await getIdByUserid(user_id);
        console.log(userid);

        const result = await pool.query(
            `
                SELECT chats.id, 
                    chats.user1_id, 
                    chats.user2_id, 
                    CASE 
                        WHEN chats.user1_id = $1 THEN users.userid
                        ELSE other_users.userid 
                    END AS other_user_id,
                    CASE 
                        WHEN chats.user1_id = $1 THEN users.profile_picture
                        ELSE other_users.profile_picture 
                    END AS other_user_profile_picture,
                    $1 AS current_user_id,  -- 로그인한 사용자의 ID를 반환
                    $2 AS current_user_userid  -- 로그인한 사용자의 userid를 반환
                FROM chats
                LEFT JOIN users ON chats.user2_id = users.id
                LEFT JOIN users AS other_users ON chats.user1_id = other_users.id
                WHERE chats.user1_id = $1 OR chats.user2_id = $1
            `, [userid, user_id]
        );
        console.log('채팅 리스트 한번 뽑아봤음', result.rows);

        if (result.rows.length === 0) {
            return res.json([]);
        }

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: '채팅방 리스트 가져오기 실패' });
    }
});

// 현재 로그인한 사용자와 특정 사용자 간의 채팅방 조회 API
app.post('/chat/get-room', async (req, res) => {
    const { currentUser, targetUser } = req.body;

    try {
        const current_id = await getIdByUserid(currentUser);
        const target_id = await getIdByUserid(targetUser);

        const result = await pool.query(
            `
                SELECT id FROM chats
                WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)
                LIMIT 1
            `, [current_id, target_id]
        );
        console.log('채팅방 아이디는~', result.rows[0]);

        if (result.rows.length > 0) {
            return res.json({ chatId: result.rows[0].id, currentUserId: current_id });
        } else {
            const createResult = await pool.query(
                `
                    INSERT INTO chats (user1_id, user2_id)
                    VALUES ($1, $2)
                    RETURNING id
                `, [current_id, target_id]
            );
            console.log('채팅방 생성했오', createResult.rows[0]);

            return res.json({ chatId: createResult.rows[0].id, currentUserId: current_id });
        }
    } catch (error) {
        res.status(500).json({ message: '채팅방을 가져오거나 생성하는 중 오류가 발생했습니다.' });
    }
});

// 새 채팅방 생성 API
app.post('/chat/create-room', async (req, res) => {
    const { user1_id, user2_id } = req.body;
    console.log('받기는 했는데 ㅅㅂ', user1_id, user2_id);

    try {
        const user1 = await getIdByUserid(user1_id);
        const user2 = await getIdByUserid(user2_id);

        const existingChat = await pool.query(
            'SELECT * FROM chats WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)',
            [user1, user2]
        );
        console.log('채팅방이 존재하는지 확인해봤음');

        if (existingChat.rows.length > 0) {
            console.log('이미 존재하는 채팅방이다 !!!');
            return res.status(400).json({ message: '이미 존재하는 채팅방입니다.' });
        }

        const result = await pool.query(
            'INSERT INTO chats (user1_id, user2_id) VALUES ($1, $2) RETURNING *',
            [user1, user2]
        );
        console.log('채팅방 생성 완료했오', result.rows[0]);

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: '채팅방 생성 실패' })
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});