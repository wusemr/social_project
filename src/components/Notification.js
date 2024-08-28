import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions
} from "react-native"
import { Server } from "@env"

const { width } = Dimensions.get('screen')

const Notification = (
    {
        actor_id,
        actor_userid,
        actor_username,
        actor_profile_picture,
        post_id,
        comment_id,
        message,
        time,
        type,
        sub_type,
        is_read,
        onNotificationPress
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

    return (
        <TouchableOpacity
            style={styles.notification}
            onPress={onNotificationPress}
        >
            <TouchableOpacity onPress={() => console.log('프로필 사진 눌림')}>
                <Image
                    source={{ uri: `${Server}/${actor_profile_picture.uri}` }}
                    style={styles.image}
                />
            </TouchableOpacity>

            <View style={styles.textContainer}>
                <TouchableOpacity onPress={() => console.log('사용자 아이디 눌림')}>
                    <Text style={[styles.contentFont, { fontWeight: 'bold' }]}>{actor_userid}</Text>
                </TouchableOpacity>
                <Text style={styles.contentFont}>{message}</Text>
                <Text style={styles.timeFont}>{formatTime(time)}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default Notification

const styles = StyleSheet.create({
    notification: {
        backgroundColor: '#00000010',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5
    },
    image: {
        width: width / 10,
        height: width / 10,
        borderRadius: 100,
        marginRight: 5
    },
    textContainer: {
        // flex: 1,
        width: width - (width / 5),
        flexDirection: 'row',
        flexWrap: 'wrap',
        // alignItems: 'flex-start',
    },
    contentFont: {
        fontSize: 15,
        color: '#333333',
        fontWeight: '400',
        flexShrink: 1
    },
    timeFont: {
        fontSize: 15,
        marginLeft: 5,
        color: '#777777'
    }
})