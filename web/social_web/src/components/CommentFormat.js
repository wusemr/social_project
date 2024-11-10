import React, { useState } from "react"
import { formatTime } from "../utils/formatTime"
import { GoHeart, GoHeartFill } from "react-icons/go"

const CommentFormat = ({
    profile_picture,
    userId,
    createdAt,
    content,
    replyCount,
    onReplyPress,
    onLikePress,
    likeCount,
    isLiked
}) => {
    const server = process.env.REACT_APP_SERVER_URL

    const [liked, setLiked] = useState(isLiked)
    const [likes, setLikes] = useState(likeCount)

    const handleLikePress = () => {
        setLiked(!liked)
        setLikes(liked ? likes - 1 : likes + 1)
        onLikePress()
    }

    return (
        <div>
            <div onClick={() => console.log('프로필로 이동하기 함수 필요함')} style={{ cursor: 'pointer' }}>
                <img
                    src={`${server}/${profile_picture.uri}`}
                    style={{ height: '30px', width: '30px' }}
                />
                <p>{userId}</p>
            </div>
            <p>{formatTime(createdAt)}</p>
            <p>{content}</p>
            <p onClick={onReplyPress} style={{ cursor: 'pointer' }}>{replyCount > 0 ? `답글 ${replyCount}개 보기` : '답글 달기'}</p>
            {
                liked ? (
                    <GoHeartFill size={24} color="red" onClick={handleLikePress} style={{ cursor: 'pointer' }} />
                ) : (
                    <GoHeart size={24} color="#666666" onClick={handleLikePress} style={{ cursor: 'pointer' }} />
                )
            }
            <p>{likeCount}</p>
        </div>
    )
}

export default CommentFormat