import React from "react"
import Modal from "react-modal"
import PostFormat from "../components/PostFormat"
import Comment from "../pages/Comment"

const PostModal = ({
    currentUser,
    isOpen,
    closeModal,
    post,
    handleLike,
    viewLikeList,
    goToProfile,
    openPost,
    closePost
}) => {
    const modalStyles = {
        overlay: {
            backgroundColor: '#00000090',
            width: '100%',
            height: '100%'
        },
        content: {
            width: '600px',
            height: '600px',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            // onAfterOpen={}
            onRequestClose={closeModal}
            shouldCloseOnOverlayClick={true}
            style={modalStyles}
            contentLable="포스트"
        >
            {
                post && (
                    <PostFormat
                        profilePic={{ uri: post.profile_picture }}
                        userid={post.userid}
                        postImages={post.images.map(image => ({ uri: image }))}
                        likeCount={Number(post.like_count)}
                        caption={post.content}
                        commentCount={Number(post.comment_count)}
                        postId={post.post_id}
                        handleLike={() => handleLike(post.post_id)}
                        isLiked={post.isLiked}
                        viewLikeList={() => viewLikeList(post.post_id)}
                        goToProfile={() => goToProfile(post.userid)}
                        openPost={() => openPost(post.post_id)}
                        closePost={() => closePost()}
                    />
                )
            }

            <Comment currentUser={currentUser} postId={post.post_id}/>
        </Modal>
    )
}

Modal.setAppElement('#root')

export default PostModal