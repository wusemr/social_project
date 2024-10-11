import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    RefreshControl
} from "react-native"
import Feather from "react-native-vector-icons/Feather"
import Octicons from "react-native-vector-icons/Octicons"
import { CONTAINER, TYPOGRAPHY } from "../../styles/commonStyles"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import PostFormat from "../../components/PostFormat"
import { Server } from "@env"
import { useUser } from "../../auth/UserContext"
import BottomSheet from "@gorhom/bottom-sheet"
import CommentScreen from "./CommentScreen"

const PostListScreen = () => {
    const navigation = useNavigation()
    const { user } = useUser()

    const [posts, setPosts] = useState()
    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [commentVisible, setCommentVisible] = useState(false)
    const [selectedPostId, setSelectedPostId] = useState(null)
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)

    const bottomSheetRef = useRef(null)
    const snapPoints = useMemo(() => ['60%'], [])

    const handleNotificationButton = () => {
        navigation.navigate("Notification")
    }

    const handleDirectButton = (currentUser) => {
        navigation.navigate("ChatList", { currentUser })
    }

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${Server}/notification/get-list?userId=${user}`);
            const data = await response.json()
            const unreadCount = data.filter(notification => !notification.is_read).length;
            setUnreadNotificationCount(unreadCount);
        } catch (error) {
            console.error('알림 데이터를 불러오는 중 오류가 발생했습니다.', error);
        }
    }

    const renderItem = ({ item }) => (
        <PostFormat
            profilePic={{ uri: item.profile_picture }}
            userid={item.userid}
            postImages={item.images.map(image => ({ uri: image }))}
            likeCount={Number(item.like_count)}
            caption={item.content}
            commentCount={Number(item.comment_count)}
            postId={item.post_id}
            handleLike={() => handleLike(item.post_id)}
            isLiked={item.isLiked}
            viewLikeList={() => viewLikeList(item.post_id)}
            goToProfile={() => goToProfile(item.userid)}
            viewComments={() => handleOpenComments(item.post_id)}
        />
    )

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${Server}/post/get-following?currentUser=${user}`);
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('게시물을 불러오는 중 오류가 발생했습니다.', error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }

    const handleLike = async (postId) => {
        try {
            const response = await fetch(`${Server}/post/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user, postId })
            });

            if (response.ok) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.post_id === postId
                            ? {
                                ...post,
                                liked: !post.liked,
                                like_count: post.liked
                                    ? post.like_count - 1
                                    : post.like_count + 1
                            }
                            : post
                    )
                );
            } else {
                console.error('좋아요 요청 실패:', await response.text());
            }
        } catch (error) {
            console.error('좋아요 처리 중 오류가 발생했습니다.', error);
        }
    }

    const viewLikeList = async (postId) => {
        try {
            const response = await fetch(`${Server}/user/get-list/like?postId=${postId}&currentUser=${user}`);
            const likedUsers = await response.json();

            if (response.ok) {
                console.log('받아온 좋아요 누른 사람 목록', likedUsers);
                navigation.navigate('LikeList', { currentUser: user, likedUsers });
            } else {
                console.error('좋아요한 사용자 목록을 불러오는 중 오류가 발생했습니다.', likedUsers.message);
            }
        } catch (error) {
            console.error('좋아요한 사용자 목록 조회를 요청하는 중 오류가 발생했습니다.', error);
        }
    }

    const handleOpenComments = (postId) => {
        setSelectedPostId(postId)
        setCommentVisible(true)
        bottomSheetRef.current?.snapToIndex(0)
    }

    const handleSheetChanges = useCallback((index) => {
        if (index === -1) {
            setCommentVisible(false)
            setSelectedPostId(null)
        }
    }, [])

    const goToProfile = (userid) => {
        navigation.navigate('Profile', { userid })
    }

    const refresh = () => {
        setIsRefreshing(true)
        fetchPosts()
    }

    useFocusEffect(
        useCallback(() => {
            fetchNotifications()
        }, [])
    )

    useEffect(() => {
        fetchPosts()
        fetchNotifications()
    }, [])

    return (
        <SafeAreaView style={CONTAINER.container}>
            <View style={CONTAINER.header}>
                <Text style={TYPOGRAPHY.bigText}>포스트</Text>
                <View style={styles.badgeContainer}>
                    <TouchableOpacity
                        onPress={handleNotificationButton}
                    >
                        <Octicons name="heart" size={26} color="#333333" />
                        {
                            unreadNotificationCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {unreadNotificationCount}
                                    </Text>
                                </View>
                            )
                        }
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => handleDirectButton(user)}
                >
                    <Feather name="send" size={26} color="#333333" />
                </TouchableOpacity>
            </View>

            {
                loading ? (
                    <Text>로딩 중...</Text>
                ) : (
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={refresh}
                            />
                        }
                        data={posts}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.post_id.toString()}
                    />
                )
            }

            <BottomSheet
                ref={bottomSheetRef}
                index={commentVisible ? 0 : -1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose={true}
            >
                {
                    selectedPostId && (
                        <CommentScreen currentUser={user} postId={selectedPostId} />
                    )
                }
            </BottomSheet>
        </SafeAreaView>
    )
}

export default PostListScreen

const styles = StyleSheet.create({
    badgeContainer: {
        position: 'relative'
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -8,
        borderRadius: 10,
        paddingHorizontal: 7,
        paddingVertical: 2,
        minWidth: 22,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E80000'
    },
    badgeText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center'
    }
})