import React, { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../auth/UserContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faHeart } from "@fortawesome/free-regular-svg-icons"

const Main = () => {
    const server = process.env.REACT_APP_SERVER_URL

    const navigate = useNavigate()

    const { user } = useContext(UserContext)

    // const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    // const [commentVisible, setCommentVisible] = useState(false)
    // const [selectedPostId, setSelectedPostId] = useState(null)
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)

    const goToNotofication = () => {
        navigate('/notification')
    }

    const goToDirectMessage = (currentUser) => {
        navigate('/directMessage')
    }

    // const goToProfile = (userId) => {
    //     navigate('/profile')
    // }

    // 알림 조회 함수
    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${server}/notification/get-list?userId=${user?.userid}`)
            const data = await response.json()
            const unreadCount = data.filter(notification => !notification.is_read).length
            setUnreadNotificationCount(unreadCount)
        } catch (error) {
            console.error('알림 데이터를 불러오는 중 오류가 발생했습니다.', error)
        }
    }

    // 게시물 조회 함수
    const fetchPosts = async () => {
        try {

        } catch (e) {

        }
    }

    // // 좋아요 & 좋아요 취소
    // const handleLike = async (postId) => {
    //     try {

    //     } catch (e) {

    //     }
    // }

    // // 게시물 및 댓글 열기
    // const handleOpenPost = (postId) => {

    // }

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
                    loading ? (
                        <p>로딩 중...</p>
                    ) : (
                        <div className="post-list">

                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Main