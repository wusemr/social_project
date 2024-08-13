import { useEffect, useState } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet
} from "react-native"
import Carousel from "react-native-reanimated-carousel"
import AntIcon from "react-native-vector-icons/AntDesign"

const PHOTO_WIDTH = 300
const PHOTO_HEIGHT = 300

const PostFormat = (
    {
        profilePic = require('../images/profile.jpeg'),
        nickname = '김젼득',
        postImages = [require('../images/Sample01.jpeg'), require('../images/Sample02.jpeg'), require('../images/Sample03.jpeg'), require('../images/Sample04.jpeg')],
        likeCount = 13042,
        caption = '아 진짜 아무것도 하기싫다 정말정말루야호',
        commentCount = 24
    }) => {

    const [likes, setLikes] = useState(likeCount)
    const [liked, setLiked] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    const formatLikes = (count) => {
        if (count >= 10000) {
            return `${(count / 10000).toFixed(1)}만`
        }
        return count.toString()
    }

    const handleLike = () => {
        setLiked(!liked)
        setLikes(liked ? likes - 1 : likes + 1)
    }

    const handleViewComments = () => {
        console.log('모든 댓글을 불러오는 중입니다...')
    }

    const renderDots = () => {
        return (
            <View style={styles.dotsContainer}>
                {
                    postImages.map((_, index) => (
                        <View
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

    return (
        <View style={styles.postContainer}>
            <TouchableOpacity
                activeOpacity={1}
                style={styles.postHeader}
            >
                <Image source={profilePic} style={styles.profilePic} />
                <Text style={styles.nickname}>{nickname}</Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center' }}>
                <Carousel
                    width={PHOTO_WIDTH}
                    height={PHOTO_HEIGHT}
                    loop={false}
                    autoPlay={false}
                    data={postImages}
                    scrollAnimationDuration={600}
                    onSnapToItem={(index) => setActiveIndex(index)}
                    renderItem={({ item }) => (
                        <Image source={item} style={styles.postImage} />
                    )}
                />
                {renderDots()}
            </View>

            <View style={styles.actions}>
                <TouchableOpacity onPress={handleLike} style={{ marginRight: 10 }}>
                    <AntIcon
                        name={liked ? 'heart' : 'hearto'}
                        size={24}
                        color={liked ? 'red' : '#777777'}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleViewComments}>
                    <AntIcon name='message1' size={24} color='#777777' />
                </TouchableOpacity>
            </View>

            <Text>좋아요 {formatLikes(likes)}개</Text>

            <View style={styles.captionContainer}>
                <Text style={styles.boldText}>{nickname}</Text>
                <Text style={styles.caption}>{caption}</Text>
            </View>

            <TouchableOpacity onPress={handleViewComments}>
                <Text style={styles.viewComments}>댓글 {commentCount}개 모두 보기</Text>
            </TouchableOpacity>
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
    nickname: {
        fontWeight: "bold",
        fontSize: 16
    },
    postImage: {
        width: PHOTO_WIDTH,
        height: PHOTO_HEIGHT,
    },
    actions: {
        flexDirection: "row",
        padding: 10
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
    boldText: {
        fontWeight: "bold"
    },
    viewComments: {
        color: "#888",
        paddingLeft: 10,
        paddingRight: 10
    },
    dotsContainer: {
        marginTop: 310,
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