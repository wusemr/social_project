import { useEffect, useState } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    FlatList,
    Dimensions,
    RefreshControl
} from "react-native"
import Ionicon from "react-native-vector-icons/Ionicons"
import FontAwesome from "react-native-vector-icons/FontAwesome5"
import { Server } from "@env"
import { TYPOGRAPHY } from "../styles/commonStyles"
import { useNavigation } from "@react-navigation/native"
import { useUser } from "../auth/UserContext"

const { height } = Dimensions.get('screen')
const { width } = Dimensions.get('window')
const numColumns = 3
const itemSize = (width - 30) / numColumns

const ProfileFormat = (props) => {
    const navigation = useNavigation()

    const { handlePressImage, userid, isFollowable, user, refreshProfile, setRefreshProfile } = props
    const [userInfo, setUserInfo] = useState(null)
    const [post, setPost] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)

    // 특정 사용자의 정보 불러오기
    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`${Server}/user/get-info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid: userid })
            });

            if (!response.ok) {
                throw new Error('서버에서 사용자 정보를 가져오는 중 오류가 발생했습니다.');
            }

            const data = await response.json();
            setUserInfo(data);
        } catch (error) {
            console.error('사용자 정보를 가져오는 중 오류가 발생했습니다.', error);
        } finally {
            setRefreshProfile(false);
        }
    }

    // 특정 사용자의 게시물 불러오기
    const fetchPosts = async () => {
        try {
            const response = await fetch(`${Server}/post/get-user?userid=${userid}`);
            console.log('일단 서버 요청 시도함');
            if (!response.ok) {
                throw new Error('게시물 조회에 실패했습니다.');
            }
            const data = await response.json();
            setPost(data);
            console.log('머 받았냐면', data);
        } catch (error) {
            console.error(error.message);
        } finally {
            setIsRefreshing(false);
        }
    }

    // 게시물 렌더
    const renderPost = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.postItem}
                onPress={() => {
                    navigation.navigate('Post', {
                        currentUser: user,
                        post_id: item.post_id
                    })
                }}
            >
                <Image
                    source={{ uri: `${Server}/${item.first_image_url}` }}
                    style={styles.postImage}
                />
            </TouchableOpacity>
        )
    }

    // 팔로우 중인지 확인하는 함수
    const checkIsFollowing = async () => {
        try {
            const response = await fetch(`${Server}/user/check-following`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid: user, following_id: userid })
            });

            if (!response.ok) {
                throw new Error('팔로우 상태를 확인하는 중 오류가 발생했습니다.');
            }
            const { isFollowing } = await response.json();
            setIsFollowing(isFollowing);
        } catch (error) {
            console.error('팔로우 상태를 확인하는 중 오류가 발생했습니다.', error);
        }
    }

    // 팔로우 버튼을 누르면 실행되는 함수
    const handleFollowButton = async () => {
        try {
            const endpoint = isFollowing ? `${Server}/user/unfollow` : `${Server}/user/follow`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid: user, following_id: userid })
            });

            if (!response.ok) {
                throw new Error('팔로우 상태를 변경하는 중 오류가 발생했습니다.');
            }

            setIsFollowing(!isFollowing);
            fetchUserInfo();
        } catch (error) {
            console.error('팔로우 상태를 변경하는 중 오류가 발생했습니다.', error);
        }
    }

    // 팔로잉 목록 보기
    const viewFollowingList = () => {
        navigation.navigate('Following', { currentUser: user, targetUser: userid })
    }

    // 팔로워 목록 보기
    const viewFollowerList = () => {
        navigation.navigate('Follower', { currentUser: user, targetUser: userid })
    }

    // 디엠 화면으로 전환
    const goToDirect = async () => {
        try {
            const response = await fetch(`${Server}/chat/get-room`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentUser: user,
                    targetUser: userInfo.userid
                })
            });

            if (!response.ok) {
                throw new Error('채팅방을 가져오거나 생성하는 중 오류가 발생했습니다.');
            }

            const data = await response.json();
            const chatId = data.chatId;
            const currentUserId = data.currentUserId;

            console.log(chatId, data.currentUserId, user, userInfo.userid);
            navigation.navigate('Chat',
                {
                    chatId: chatId,
                    currentUserId: currentUserId,
                    currentUser: user,
                    otherUser: userInfo.userid,
                    other_profile_picture: userInfo.profile_picture
                }
            )
        } catch (error) {
            console.error('채팅방 이동에 실패했습니다.', error)
        }
    }

    // 새로고침
    const refresh = () => {
        setIsRefreshing(true)
        fetchPosts()
        fetchUserInfo()
        if (user != userid) {
            checkIsFollowing()
        }
    }

    // userid가 바뀔 때마다 실행
    useEffect(() => {
        if (userid) {
            fetchUserInfo()
            fetchPosts()
            if (user != userid) {
                checkIsFollowing()
            }
        }
    }, [userid])

    // 페이지 최초 실행 시 실행
    useEffect(() => {
        if (refreshProfile) {
            fetchUserInfo()
        }
    }, [])

    return (
        <FlatList
            data={post}
            renderItem={renderPost}
            keyExtractor={(item) => item.post_id.toString()}
            numColumns={numColumns}
            contentContainerStyle={styles.postsContainer}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={refresh}
                />
            }
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
                <View style={styles.profileHeaderContainer}>
                    <View style={styles.profileContainer}>
                        <View style={styles.infoContainer}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={handlePressImage}
                            >
                                {
                                    userInfo && userInfo.profile_picture ? (
                                        <Image
                                            source={{ uri: `${Server}/${userInfo.profile_picture}` }}
                                            style={styles.profileImage}
                                        />
                                    ) : (
                                        <View style={styles.profileImageContainer}>
                                            <FontAwesome name="user-alt" size={50} color='#F9F9F9' />
                                        </View>
                                    )
                                }
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.infoTextContainer}
                            >
                                <Text style={[styles.infoText, { fontWeight: '600' }]}>
                                    {userInfo ? userInfo.posts_count : '로드중'}
                                </Text>
                                <Text style={styles.infoText}>게시물</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.infoTextContainer}
                                onPress={viewFollowerList}
                            >
                                <Text style={[styles.infoText, { fontWeight: '600' }]}>
                                    {userInfo ? userInfo.followers_count : '로드중'}
                                </Text>
                                <Text style={styles.infoText}>팔로워</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.infoTextContainer}
                                onPress={viewFollowingList}
                            >
                                <Text style={[styles.infoText, { fontWeight: '600' }]}>
                                    {userInfo ? userInfo.following_count : '로드중'}
                                </Text>
                                <Text style={styles.infoText}>팔로잉</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={[styles.infoText, { fontWeight: 'bold' }]}>
                                {userInfo ? userInfo.username : '이름'}
                            </Text>
                            {
                                userInfo && userInfo.info_text ? (
                                    <Text style={styles.infoText}>
                                        {userInfo ? userInfo.info_text : '소개'}
                                    </Text>
                                ) : (<></>)
                            }
                        </View>
                        {
                            isFollowable && (
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        onPress={handleFollowButton}
                                        style={isFollowing ? styles.cancelFollowButton : styles.followButton}
                                    >
                                        <Text style={[TYPOGRAPHY.buttonText, { fontSize: 16 }]}>
                                            {isFollowing ? '팔로우 취소' : '팔로우'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={goToDirect}
                                        style={styles.messageButton}
                                    >
                                        <Text style={[TYPOGRAPHY.buttonText, { fontSize: 16 }]}>메시지</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    </View>

                    <View style={styles.postTypeContainer}>
                        <TouchableOpacity>
                            <Ionicon name="grid" size={30} color="#555555" />
                        </TouchableOpacity>
                    </View>
                </View>
            }
        />
    )
}

export default ProfileFormat

const styles = StyleSheet.create({
    profileHeaderContainer: {
        backgroundColor: '#f9f9f9',
        margin: 0,
        padding: 0
    },
    profileContainer: {
        justifyContent: 'center',
        margin: 0,
        padding: '3%'
    },
    profileImageContainer: {
        backgroundColor: '#00000030',
        width: 80,
        height: 80,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    infoTextContainer: {
        backgroundColor: '#00000010',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40
    },
    infoText: {
        fontSize: 16,
        color: '#333333'
    },
    profileImage: {
        borderRadius: 100,
        height: 100,
        width: 100
    },
    textContainer: {
        paddingHorizontal: '3%',
        paddingVertical: '3%'
    },
    buttonContainer: {
        marginTop: '2%',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    followButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#005DFF',
        height: height / 25,
        width: (width - 80) / 2,
        borderRadius: 10
    },
    cancelFollowButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000040',
        height: height / 25,
        width: (width - 80) / 2,
        borderRadius: 10
    },
    messageButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000040',
        height: height / 25,
        width: (width - 80) / 2,
        borderRadius: 10
    },
    postTypeContainer: {
        backgroundColor: '#00000010',
        height: 40,
        alignItems: 'center'
    },
    postsContainer: {

    },
    postItem: {
        width: itemSize,
        height: itemSize,
        marginRight: 2.5,
        marginBottom: 2.5
    },
    postImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    }
})