import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from "react-native"
import { TYPOGRAPHY } from "../styles/commonStyles"
import Octicons from "react-native-vector-icons/Octicons"
import { Server } from "@env"
import { useState } from "react"

const { width } = Dimensions.get('window')

const Comment = (
    {
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

    const formatTime = (time) => {
        const now = new Date()
        const notificationTime = new Date(time)
        const diffMs = now - notificationTime

        const diffSeconds = Math.floor(diffMs / 1000)
        const diffMinutes = Math.floor(diffSeconds / 60)
        const diffHours = Math.floor(diffMinutes / 60)
        const diffDays = Math.floor(diffHours / 24)
        const diffWeeks = Math.floor(diffDays / 7)
        const diffMonths = Math.floor(diffDays / 30)
        const diffYears = Math.floor(diffDays / 365)

        if (diffSeconds < 60) {
            return '방금 전'
        } else if (diffMinutes < 60) {
            return `${diffMinutes}분 전`
        } else if (diffHours < 24) {
            return `${diffHours}시간 전`
        } else if (diffDays < 7) {
            return `${diffDays}일 전`
        } else if (diffDays < 30) {
            return `${diffWeeks}주 전`
        } else if (diffDays < 365) {
            return `${diffMonths}개월 전`
        } else {
            return `${diffYears}년 전`
        }
    }

    const [liked, setLiked] = useState(isLiked)
    const [likes, setLikes] = useState(likeCount)

    const handleLikePress = () => {
        setLiked(!liked)
        setLikes(liked ? likes - 1 : likes + 1)
        onLikePress()
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Image source={{ uri: `${Server}/${profile_picture.uri}` }} style={styles.profile_picture} />
            </TouchableOpacity>

            <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                    <TouchableOpacity>
                        <Text style={TYPOGRAPHY.boldText}>{userId}</Text>
                    </TouchableOpacity>

                    <Text style={TYPOGRAPHY.smallText}>{formatTime(createdAt)}</Text>
                </View>

                <Text style={TYPOGRAPHY.normalText}>{content}</Text>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity onPress={onReplyPress}>
                        <Text style={styles.replyButton}>
                            {replyCount > 0 ? `답글 ${replyCount}개 보기` : '답글 달기'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLikePress} style={styles.likeButton}>
                        <Octicons name={liked ? "heart-fill" : "heart"} size={20} color={liked ? "red" : "gray"} />
                        <Text style={styles.likeCount}>{likeCount}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Comment

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    profile_picture: {
        width: width / 12,
        height: width / 12,
        borderRadius: 100
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userId: {
        fontWeight: 'bold',
    },
    createdAt: {
        color: '#aaa',
        fontSize: 12,
    },
    content: {
        marginVertical: 5,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    replyButton: {
        marginRight: 15,
        color: '#555',
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeCount: {
        marginLeft: 5,
        color: '#555',
    }
})