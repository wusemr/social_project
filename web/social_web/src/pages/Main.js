import React, { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../auth/UserContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faHeart } from "@fortawesome/free-regular-svg-icons"
import PostFormat from "../components/PostFormat"
import PostModal from "./PostModal"

const Main = () => {
    const server = process.env.REACT_APP_SERVER_URL

    const navigate = useNavigate()

    const { user } = useContext(UserContext)

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedPostId, setSelectedPostId] = useState(null)

    const handleOpenPost = (postID) => {
        if (!modalOpen) {
            setSelectedPostId(postID)
            setModalOpen(true)
        }
    }

    const handleClosePost = () => {
        setSelectedPostId(null)
        setModalOpen(false)
    }

    const goToNotofication = () => {
        navigate('/notification')
    }

    const goToDirectMessage = (currentUser) => {
        navigate('/directMessage')
    }

    const goToProfile = (userId) => {
        navigate('/profile')
    }

    // 알림 조회 함수
    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${server}/notification/get-list?userId=${user?.userid}`)
            const data = await response.json()
            console.log('받아온 알림 데이터:', data)
            const unreadCount = data.filter(notification => !notification.is_read).length
            setUnreadNotificationCount(unreadCount)
        } catch (error) {
            console.error('알림 데이터를 불러오는 중 오류가 발생했습니다.', error)
        }
    }

    // 게시물 조회 함수
    const fetchPosts = async () => {
        try {
            const response = await fetch(`${server}/post/get-following?currentUser=${user?.userid}`)
            const data = await response.json()
            console.log('받아온 게시물 데이터:', data)
            setPosts(data)
        } catch (e) {
            console.error('게시물을 불러오는 중 오류가 발생했습니다.', e)
        }
    }

    // 좋아요 & 좋아요 취소
    const handleLike = async (postId) => {
        try {
            const response = await fetch(`${server}/post/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.userid, postId })
            })

            if (response.ok) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.post_id === postId
                            ? {
                                ...post,
                                liked: !post.liked,
                                like_count: post.liked
                                    ? post.like_count - 1
                                    : post.like_count
                            }
                            : post
                    )
                )
            } else {
                console.error('좋아요 요청 실패:', await response.text())
            }
        } catch (e) {
            console.error('좋아요 처리 중 오류가 발생했습니다.', e)
        }
    }

    // 좋아요 리스트 출력
    const viewLikeList = async (postId) => {
        try {
            const response = await fetch(`${server}/user/get-list/like?postId=${postId}&currentUser=${user?.userid}`)
            const likedUsers = await response.json()

            if (response.ok) {
                console.log('받아온 좋아요 누른 사람 목록:', likedUsers)
                // 좋아요 리스트 출력할 모달?화면? 추가 필요
            } else {
                console.error('좋아요한 사용자 목록을 불러오는 중 오류가 발생했습니다.')
            }
        } catch (e) {
            console.error('좋아요한 사용자 목록 조회를 요청하는 중 오류가 발생했습니다.', e)
        }
    }

    // const refresh = () => {
    //     setIsRefreshing(true)
    //     fetchPosts()
    //     fetchNotifications()
    // }

    useEffect(() => {
        console.log(`현재 로그인 중인 사용자는 ${user?.userid} 입니다.`)
        fetchPosts()
        fetchNotifications()
    }, [user])

    return (
        <div className="post-list-screen">
            {/* 헤더 영역 */}
            <div className="header">
                <h1>포스트</h1>
                <div>
                    <div onClick={goToNotofication}>
                        <FontAwesomeIcon icon={faHeart} size="lg" color="#555555" />
                    </div>
                    <div onClick={goToDirectMessage}>
                        <FontAwesomeIcon icon={faPaperPlane} size="lg" color="#555555" />
                    </div>
                </div>
            </div>

            <div className="main-content">
                {
                    posts ? (
                        <div className="post-list">
                            <div>
                                {
                                    posts.map(item => (
                                        <PostFormat
                                            key={item.post_id}
                                            profilePic={{ uri: item.profile_picture }}
                                            userid={item.userid}
                                            postImages={item.images.map(image => ({ uri: image }))}
                                            likeCount={Number(item.like_count)}
                                            caption={item.content}
                                            commentCount={Number(item.comment_count)}
                                            postId={item.post_id}
                                            handleLike={() => handleLike(item.post_id)}
                                            isLiked={item.isLiked}
                                            viewLikeList={() => viewLikeList(item.post_id)}
                                            goToProfile={() => goToProfile(item.userid)}
                                            openPost={() => handleOpenPost(item.post_id)}
                                            closePost={() => handleClosePost()}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    ) : (
                        <p>로딩 중...</p>
                    )
                }
            </div>

            {
                selectedPostId && (
                    <PostModal
                        currentUser={user?.userid}
                        isOpen={modalOpen}
                        closeModal={handleClosePost}
                        post={posts.find(post => post.post_id === selectedPostId)}
                        handleLike={handleLike}
                        viewLikeList={viewLikeList}
                        goToProfile={goToProfile}
                        openPost={handleOpenPost}
                        closePost={handleClosePost}
                    />
                )
            }
        </div>
    )
}

export default Main