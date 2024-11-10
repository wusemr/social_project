import React, { useEffect, useState } from "react"
import CommentFormat from "../components/CommentFormat"

const Comment = ({ currentUser, postId }) => {
    const server = process.env.REACT_APP_SERVER_URL

    const [newComment, setNewComment] = useState('')
    const [commentList, setCommentList] = useState([])

    // 댓글 조회 함수
    const fetchComments = async () => {
        try {
            const response = await fetch(`${server}/comment/get-comments?postId=${postId}&userId=${currentUser}`)
            const data = await response.json()
            console.log(data)
            if (data.success) {
                setCommentList(data.comments)
            }
        } catch (error) {
            console.error('댓글을 불러오는 도중 오류가 발생했습니다.', error)
        }
    }

    // 댓글 작성 함수
    const handleAddComment = async () => {
        if (newComment.trim() === '') return

        try {
            const response = await fetch(`${server}/comment/add-comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser, postId: postId, content: newComment })
            })

            const data = await response.json()

            if (data.success) {
                setCommentList([...commentList, data.comment])
                setNewComment('')
                fetchComments()
            }
        } catch (error) {
            console.error('댓글을 작성하는 도중 오류가 발생했습니다.', error)
        }
    }

    // 댓글 좋아요 함수
    const handleLike = async (commentId) => {
        console.log('id', commentId, '번 댓글 좋아요 눌림')
        try {
            const response = await fetch(`${server}/comment/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser, commentId: commentId })
            })

            const data = await response.json();

            if (data.success) {
                setCommentList(commentList.map(comment =>
                    comment.id === commentId ? { ...comment, is_liked: data.liked, like_count: data.liked ? comment.like_count + 1 : comment.like_count - 1 } : comment
                ))
            }
        } catch (error) {
            console.error('좋아요 처리 중 오류가 발생했습니다.', error)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [])

    return (
        <div>
            {
                commentList.map(item => (
                    <CommentFormat
                        key={item.id}
                        profile_picture={{ uri: item.profile_picture }}
                        userId={item.userid}
                        createdAt={item.created_at}
                        content={item.content}
                        replyCount={item.replyCount}
                        onReplyPress={() => console.log(`${item.post_id}번째 게시물의 ${item.id}번째 댓글에 답글달기를 시도했습니다.`)}
                        onLikePress={() => handleLike(item.id)}
                        likeCount={item.like_count}
                        isLiked={item.liked}
                    />
                ))
            }
        </div>
    )
}

export default Comment