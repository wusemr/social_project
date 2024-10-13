import { useEffect, useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    FlatList
} from "react-native"
import { CONTAINER, TYPOGRAPHY } from "../../styles/commonStyles"
import Notification from "../../components/Notification"
import { Server } from "@env"
import { useUser } from "../../auth/UserContext"
import { useNavigation } from "@react-navigation/native"

const NotificationScreen = () => {
    const { user } = useUser()
    const [notifications, setNotifications] = useState([])
    const navigation = useNavigation()

    const fetchNotification = async () => {
        try {
            const response = await fetch(`${Server}/notification/get-list?userId=${user}`);
            const data = await response.json();
            console.log('알림이 온게 뭐냐면', data);
            setNotifications(data);
        } catch (error) {
            console.error('알림을 불러오는 중 오류가 발생했습니다.', error);
        }
    }

    const markNotificationsAsRead = async (unreadNotificationIds) => {
        try {
            await fetch(`${Server}/notification/mark-as-read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notificationIds: unreadNotificationIds })
            });
        } catch (error) {
            console.error('알림 읽음 처리 중 오류가 발생했습니다.', error);
        }
    }

    const handleNotificationsRead = () => {
        const unreadNotificationIds = notifications
            .filter(notification => !notification.is_read)
            .map(notification => notification.id)

        if (unreadNotificationIds.length > 0) {
            markNotificationsAsRead(unreadNotificationIds)
        }
    }

    const renderNotification = ({ item }) => {
        return (
            <Notification
                actor_id={item.actor_id}
                actor_userid={item.actor_userid}
                actor_username={item.actor_username}
                actor_profile_picture={{ uri: item.actor_profile_picture }}
                post_id={item.post_id}
                comment_id={item.comment_id}
                message={item.message}
                time={item.time}
                type={item.type}
                sub_type={item.sub_type}
                is_read={item.is_read}
                onNotificationPress={() => onNotificationPress(item)}
            />
        )
    }

    const onNotificationPress = (item) => {
        const { type, sub_type, post_id, comment_id, actor_userid } = item

        switch (`${type}_${sub_type}`) {
            case 'follow_profile':
                navigation.navigate('Profile', { userid: actor_userid })
                break;
            case 'like_post':
                navigation.navigate('Post', { currentUser: user, post_id })
                break;
            case 'comment_post':
            case 'comment_reply':
                navigation.navigate('Post', { post_id, comment_id })
                break;
            case 'like_comment':
                navigation.navigate('Post', { post_id, comment_id })
                break
            default:
                console.log('알 수 없는 알림 유형입니다:', type, sub_type)
        }
    }

    useEffect(() => {
        fetchNotification()
    }, [user])

    useEffect(() => {
        handleNotificationsRead()
    }, [notifications])

    return (
        <SafeAreaView style={CONTAINER.container}>
            <View style={CONTAINER.header}>
                <Text style={TYPOGRAPHY.bigText}>알림</Text>
            </View>

            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    )
}

export default NotificationScreen