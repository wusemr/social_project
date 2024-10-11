import { useEffect, useState } from "react"
import {
	SafeAreaView,
	View,
	Text,
	TouchableOpacity,
	TextInput,
	FlatList,
	StyleSheet,
	Image,
	Dimensions
} from "react-native"
import { CONTAINER, TYPOGRAPHY } from "../../styles/commonStyles"
import { UserMessage } from "../../components/Message"
import { OtherMessage } from "../../components/Message"
import { useNavigation } from "@react-navigation/native"
import Octicons from "react-native-vector-icons/Octicons"
import { Server } from "@env"

const { width } = Dimensions.get('screen')

const ChatScreen = ({ route }) => {
	const { chatId, currentUserId, currentUser, otherUser, other_profile_picture } = route.params
	const [messages, setMessages] = useState([])
	const [newMessage, setNewMessage] = useState('')
	const navigation = useNavigation()

	const fetchMessages = async () => {
		console.log('ㅈ;금채팅방 아이디 이건데', chatId);
		try {
			const response = await fetch(`${Server}/chat/get-message/${chatId}`);
			const data = await response.json();

			if (data.length === 0) {
				console.log('메시지가 없습니다.');
			} else {
				console.log('메시지~', data);
				setMessages(data);
			}
		} catch (error) {
			console.error('메시지를 불러오는 중 오류가 발생했습니다.', error);
		}
	}

	const handleSend = async () => {
		try {
			console.log('나는', currentUser);
			const response = await fetch(`${Server}/chat/send-message`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chat_id: chatId,
					sender_id: currentUser,
					message_text: newMessage
				})
			});

			if (response.ok) {
				const newMessageData = await response.json();
				setMessages([...messages, newMessageData]);
				setNewMessage('');
				fetchMessages();
			}
		} catch (error) {
			console.error('메시지 전송 중 오류가 발생했습니다.', error);
		}
	}

	const renderItem = ({ item }) => {
		if (item.sender_id === currentUserId) {
			return <UserMessage message={item.message_text} />
		} else {
			return <OtherMessage message={item.message_text} />
		}
	}

	useEffect(() => {
		fetchMessages()
	}, [chatId])

	return (
		<SafeAreaView style={CONTAINER.container}>
			<View style={CONTAINER.header}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.backButton}
				>
					<Octicons name="chevron-left" size={24} color='#555555' />
				</TouchableOpacity>
				
				<TouchableOpacity
					onPress={() => navigation.navigate('Profile', { userid: otherUser })}
					style={styles.headerContainer}
				>
					<Image
						source={{ uri: `${Server}/${other_profile_picture}` }}
						style={styles.profileImage}
					/>
					<Text style={TYPOGRAPHY.boldText}>{otherUser}</Text>
				</TouchableOpacity>
			</View>
			{
				messages.length === 0 ? (
					<View style={styles.noMessagesContainer}>
						<Text style={styles.noMessagesText}>첫 메시지를 보내보세요!</Text>
						<TouchableOpacity
							style={styles.profileButton}
							onPress={() => navigation.navigate('Profile', { userid: otherUser })}
						>
							<Text style={styles.profileButtonText}>상대방의 프로필 보기</Text>
						</TouchableOpacity>
					</View>
				) : (
					<FlatList
						data={messages}
						renderItem={renderItem}
						keyExtractor={(item) => item.id.toString()}
						contentContainerStyle={styles.messageContainer}
					/>
				)
			}
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.textInput}
					value={newMessage}
					onChangeText={setNewMessage}
					placeholder="메시지 보내기..."
				/>
				<TouchableOpacity onPress={handleSend} style={styles.sendButton}>
					<Text style={styles.sendButtonText}>전송</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

export default ChatScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F5F5',
		padding: 10,
	},
	backButton: {
		marginHorizontal: 10
	},
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	profileImage: {
		width: width / 10,
		height: width / 10,
		borderRadius: 100,
		marginRight: 10,
	},
	messageContainer: {
		paddingBottom: 80,
	},
	noMessagesContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	noMessagesText: {
		fontSize: 18,
		color: '#666',
		marginBottom: 20,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		backgroundColor: '#FFFFFF',
		borderTopWidth: 1,
		borderTopColor: '#DDDDDD',
	},
	textInput: {
		flex: 1,
		height: 40,
		borderColor: '#DDDDDD',
		borderWidth: 1,
		borderRadius: 20,
		paddingHorizontal: 10,
		fontSize: 15,
		backgroundColor: '#F9F9F9',
	},
	sendButton: {
		marginLeft: 10,
		backgroundColor: '#007BFF',
		borderRadius: 20,
		padding: 10,
	},
	sendButtonText: {
		color: '#FFFFFF',
		fontWeight: 'bold',
	},
})