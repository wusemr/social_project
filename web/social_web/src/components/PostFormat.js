import React, { useEffect, useState } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { GoHeart, GoHeartFill } from "react-icons/go"
import { RiMessage3Line } from "react-icons/ri"

const PostFormat = ({
    profilePic,
    userid,
    postImages,
    likeCount,
    caption,
    commentCount,
    postId,
    handleLike,
    isLiked,
    viewLikeList,
    goToProfile,
    openPost,
    closePost
}) => {
    const server = process.env.REACT_APP_SERVER_URL

    const height = window.innerHeight
    const PROFILE_PICTURE_SIZE = height / 20
    const PHOTO_SIZE = height / 2

    const settings = {
        arrows: true,
        dots: true,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        accessibility: false
    }

    const [likes, setLikes] = useState(likeCount)
    const [liked, setLiked] = useState(isLiked)

    // 좋아요 개수 포맷 (1만 이상의 경우 만 단위로 출력)
    const formatLikes = (count) => {
        if (count >= 10000) {
            return `${(count / 10000).toFixed(1)}만`
        }
        return count.toString()
    }

    // 좋아요 버튼 이벤트
    const handleLikeButton = () => {
        handleLike(postId)
        setLiked(!liked)
        setLikes(liked ? likes - 1 : likes + 1)
    }

    const handleOpenPost = () => {
        openPost(postId)
    }

    const handleClosePost = () => {
        closePost()
    }

    // 좋아요 누른 사용자 보기 버튼 이벤트
    const handleViewLikeButton = () => {
        viewLikeList(postId)
    }

    useEffect(() => {
        setLiked(isLiked)
    }, [isLiked])

    return (
        <div className="post-format">
            <div
                onClick={goToProfile}
                style={{ cursor: 'pointer' }}
            >
                <img
                    src={`${server}/${profilePic.uri}`}
                    style={{ width: PROFILE_PICTURE_SIZE, height: PROFILE_PICTURE_SIZE, borderRadius: 100 }}
                />
                <p>{userid}</p>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <Slider {...settings} style={{ width: PHOTO_SIZE }}>
                    {
                        postImages.map((item, index) => (
                            <div key={index} style={{ width: PHOTO_SIZE, height: PHOTO_SIZE, overflow: 'hidden' }}>
                                <img
                                    src={`${server}/${item.uri}`}
                                    style={{ width: PHOTO_SIZE, height: PHOTO_SIZE }}
                                />
                            </div>
                        ))
                    }
                </Slider>
            </div>

            <span style={{ flexDirection: 'row' }}>
                {
                    liked ? (
                        <GoHeartFill size={24} color="red" onClick={handleLikeButton} style={{ cursor: 'pointer', marginTop: '30px', marginRight: '10px' }} />
                    ) : (
                        <GoHeart size={24} color="#666666" onClick={handleLikeButton} style={{ cursor: 'pointer', marginTop: '30px', marginRight: '10px' }} />
                    )
                }

                <RiMessage3Line size={24} color="#666666" onClick={() => handleOpenPost()} style={{ cursor: 'pointer' }} />
            </span>

            <p
                onClick={handleViewLikeButton}
                style={{ cursor: 'pointer' }}
            >
                좋아요 {formatLikes(likes)}개
            </p>

            <div style={{ flexDirection: 'row' }}>
                <span
                    onClick={goToProfile}
                    style={{ cursor: 'pointer' }}
                >
                    {userid}
                </span>

                <span
                    style={{ cursor: 'text' }}
                >
                    {caption}
                </span>
            </div>

            {
                commentCount !== 0 ? (
                    <p
                        onClick={() => handleOpenPost()}
                        style={{ cursor: 'pointer' }}
                    >
                        댓글 {commentCount}개 모두 보기
                    </p>
                ) : (
                    <p
                        onClick={() => handleOpenPost()}
                        style={{ cursor: 'pointer' }}
                    >
                        댓글 달기...
                    </p>
                )
            }
        </div>
    )
}

export default PostFormat