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

const { width } = Dimensions.get('window')
const numColumns = 3
const itemSize = (width - 30) / numColumns

const ProfileFormat = (props) => {
    const { handlePressImage, userid } = props
    const [userInfo, setUserInfo] = useState(null)
    const [post, setPost] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)

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
        }
    }

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

    const renderPost = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.postItem}
                onPress={() => console.log(`Pressed post with id: ${item.post_id}`)}
            >
                <Image source={{ uri: `${Server}/${item.first_image_url}` }} style={styles.postImage} />
            </TouchableOpacity>
        )
    }

    const refresh = () => {
        setIsRefreshing(true)
        fetchPosts()
        fetchUserInfo()
    }

    useEffect(() => {
        if (userid) {
            fetchUserInfo()
            fetchPosts()
        }
    }, [userid])

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
                            >
                                <Text style={[styles.infoText, { fontWeight: '600' }]}>
                                    {userInfo ? userInfo.followers_count : '로드중'}
                                </Text>
                                <Text style={styles.infoText}>팔로워</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.infoTextContainer}
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
                                ) : ( <></> )
                            }
                        </View>
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