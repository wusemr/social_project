import { useEffect, useState } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions
} from "react-native"
import Carousel from "react-native-reanimated-carousel"
import Octicon from "react-native-vector-icons/Octicons"
import Feather from "react-native-vector-icons/Octicons"
import { Server } from "@env"

const { height } = Dimensions.get('screen')
const { width } = Dimensions.get('window')
const PHOTO_WIDTH = width - (width / 10)
const PHOTO_HEIGHT = width - (width / 10)

const PostFormat = (
    {
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
        goToProfile
    }) => {

    const [likes, setLikes] = useState(likeCount)
    const [liked, setLiked] = useState(isLiked)
    const [activeIndex, setActiveIndex] = useState(0)

    const formatLikes = (count) => {
        if (count >= 10000) {
            return `${(count / 10000).toFixed(1)}만`
        }
        return count.toString()
    }

    const handleLikeButton = () => {
        handleLike(postId)
        setLiked(!liked)
        setLikes(liked ? likes - 1 : likes + 1)
    }

    const handleViewComments = () => {
        console.log('모든 댓글을 불러오는 중입니다...')
    }

    const handleViewLikeButton = () => {
        viewLikeList(postId)
    }

    const renderDots = () => {
        return (
            <View style={styles.dotsContainer}>
                {
                    postImages.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === activeIndex ? styles.activeDot : null
                            ]}
                        />
                    ))
                }
            </View>
        )
    }

    useEffect(() => {
        setLiked(isLiked)
    }, [isLiked])

    return (
        <View style={styles.postContainer}>
            <TouchableOpacity
                activeOpacity={1}
                style={styles.postHeader}
                onPress={goToProfile}
            >
                <Image
                    source={{ uri: `${Server}/${profilePic.uri}` }}
                    style={styles.profilePic}
                />
                <Text style={[styles.textSize, styles.boldText]}>{userid}</Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center', height: PHOTO_WIDTH }}>
                <Carousel
                    width={PHOTO_WIDTH}
                    height={PHOTO_HEIGHT}
                    loop={false}
                    autoPlay={false}
                    data={postImages}
                    scrollAnimationDuration={600}
                    onSnapToItem={(index) => setActiveIndex(index)}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: `${Server}/${item.uri}` }}
                            style={styles.postImage}
                        />
                    )}
                />
            </View>
            {renderDots()}

            <View style={styles.actions}>
                <TouchableOpacity onPress={handleLikeButton} style={{ marginRight: 10 }}>
                    <Octicon
                        name={liked ? 'heart-fill' : 'heart'}
                        size={24}
                        color={liked ? 'red' : '#666666'}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleViewComments}>
                    <Feather name='comment' size={24} color='#666666' />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={handleViewLikeButton}
                activeOpacity={1}
            >
                <Text style={[styles.textSize, styles.boldText]}>
                    좋아요 {formatLikes(likes)}개
                </Text>
            </TouchableOpacity>

            <View style={styles.captionContainer}>
                <TouchableOpacity onPress={goToProfile} activeOpacity={1}>
                    <Text style={[styles.textSize, styles.boldText]}>{userid}</Text>
                </TouchableOpacity>
                <Text style={styles.textSize}>{caption}</Text>
            </View>

            {
                commentCount !== 0 && (
                    <TouchableOpacity onPress={handleViewComments}>
                        <Text style={styles.viewComments}>댓글 {commentCount}개 모두 보기</Text>
                    </TouchableOpacity>
                )
            }
        </View>
    )
}

export default PostFormat

const styles = StyleSheet.create({
    postContainer: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingBottom: 10
    },
    postHeader: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10
    },
    textSize: {
        fontSize: 16
    },
    boldText: {
        fontWeight: '700',
        color: '#333333'
    },
    postImage: {
        width: PHOTO_WIDTH,
        height: PHOTO_HEIGHT,
    },
    actions: {
        flexDirection: "row",
        padding: 10,
    },
    likeCount: {
        fontWeight: "bold",
        paddingLeft: 10
    },
    caption: {
        paddingLeft: 10,
        paddingRight: 10
    },
    captionContainer: {
        flexDirection: 'row'
    },
    viewComments: {
        color: "#888",
        paddingLeft: 10,
        paddingRight: 10
    },
    dotsContainer: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 100,
        backgroundColor: '#DDDDDD',
        marginHorizontal: 4
    },
    activeDot: {
        backgroundColor: '#555555'
    }
})