import {
    SafeAreaView,
    View,
    Text,
    FlatList
} from "react-native"
import { CONTAINER, TYPOGRAPHY } from "../../styles/commonStyles"
import Notification from "../../components/Notification"

const notifications = [
    {
        id: '1',
        image: require('../../images/Sample01.jpeg'),
        content: '알림 내용 1입니다.',
        time: '30분 전'
    },
    {
        id: '2',
        image: require('../../images/Sample02.jpeg'),
        content: '알림 내용 2입니다.',
        time: '1시간 전'
    },
    {
        id: '3',
        image: require('../../images/Sample03.jpeg'),
        content: '알림 내용 3입니다.',
        time: '1시간 전'
    },
    {
        id: '4',
        image: require('../../images/Sample01.jpeg'),
        content: '알림 내용 4입니다.',
        time: '2시간 전'
    },
    {
        id: '5',
        image: require('../../images/Sample04.jpeg'),
        content: '알림 내용 5입니다.',
        time: '3시간 전'
    },
    {
        id: '6',
        image: require('../../images/Sample03.jpeg'),
        content: '알림 내용 6입니다.',
        time: '3시간 전'
    },
    {
        id: '7',
        image: require('../../images/Sample02.jpeg'),
        content: '알림 내용 7입니다.',
        time: '6시간 전'
    },
    {
        id: '8',
        image: require('../../images/Sample01.jpeg'),
        content: '알림 내용 8입니다.',
        time: '12시간 전'
    },
    {
        id: '9',
        image: require('../../images/Sample01.jpeg'),
        content: '알림 내용 9입니다.',
        time: '1일 전'
    },
    {
        id: '10',
        image: require('../../images/Sample01.jpeg'),
        content: '알림 내용 10입니다.',
        time: '2일 전'
    },
]

const NotificationScreen = () => {
    const renderNotification = ({item}) => {
        return (
            <Notification
                image={item.image}
                content={item.content}
                time={item.time}
            />
        )
    }    

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