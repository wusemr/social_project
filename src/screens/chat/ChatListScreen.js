import { useEffect, useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Server } from "@env"
import { CONTAINER } from "../../styles/commonStyles"

const ChatListScreen = ({ route }) => {
    const navigation = useNavigation()
    const { currentUser } = route.params || {}
    const [chatList, setChatList] = useState([])
    const [followingUsers, setFollowingUsers] = useState([])

    const fetchChatList = async () => {
        try {
            const response = await fetch(`${Server}/chat/get-list/${currentUser}`);
            const data = await response.json();
            console.log(data)
            setChatList(data);
        } catch (error) {
            console.error('채팅 목록을 불러오는 중 오류가 발생했습니다.', error);
        }
    }

    const fetchFollowingUsers = async () => {
        try {
            const response = await fetch(`${Server}/user/get-list/following?currentUser=${currentUser}&targetUser=${currentUser}`);
            const data = await response.json();
            console.log(data)
            const randomUsers = data.sort(() => 0.5 - Math.random()).slice(0, 5);
            setFollowingUsers(randomUsers);
        } catch (error) {
            console.error('팔로우한 사용자 목록을 불러오는 중 오류가 발생했습니다.', error);
        }
    }

    const createChat = async (otherUserId) => {
        try {
            console.log('지금 나는', currentUser, '이고, 대화 상대는', otherUserId)
            const response = await fetch(`${Server}/chat/create-room`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user1_id: currentUser, user2_id: otherUserId })
            });

            const newChat = await response.json();
            console.log('채팅 아이디는 이거얌', newChat.id);

            if (response.status === 400) {
                navigation.navigate('Chat', { chatId: newChat.id, otherUser: otherUserId });
            } else {
                navigation.navigate('Chat', { chatId: newChat.id, otherUser: otherUserId });
            }
        } catch (error) {
            console.error('새로운 채팅방 생성 중 오류가 발생했습니다.', error);
        }
    }

    useEffect(() => {
        fetchChatList()
        fetchFollowingUsers()
    }, [])

    const renderChatList = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('Chat', { chatId: item.id, otherUser: item.user2_userid, other_profile_picture: item.user2_profile_picture })}
        >
            <Image
                source={{ uri: `${Server}/${item.user2_profile_picture}` }}
                style={styles.profileImage}
            />
            <View style={styles.chatInfo}>
                <Text style={styles.userid}>{item.user2_userid}</Text>
                {/* <Text style={styles.message}>{item.last_message}</Text> */}
            </View>
        </TouchableOpacity>
    )

    const renderFollowingUser = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => createChat(item.userid)}
        >
            <Image
                source={{ uri: `${Server}/${item.profile_picture}` }}
                style={styles.profileImage}
            />
            <View style={styles.chatInfo}>
                <Text style={styles.userid}>{item.userid}</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={CONTAINER.container}>
            {
                chatList.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>새로운 채팅을 시작해보세요!</Text>
                        <FlatList
                            data={followingUsers}
                            renderItem={renderFollowingUser}
                            keyExtractor={(item) => item.id.toString()}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </View>
                ) : (
                    <FlatList
                        data={chatList}
                        renderItem={renderChatList}
                        keyExtractor={(item) => item.id.toString()}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                )
            }
        </SafeAreaView>
    )
}

export default ChatListScreen

const styles = StyleSheet.create({
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    chatInfo: {
        flex: 1,
    },
    userid: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 14,
        color: '#666',
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#666',
    }
})