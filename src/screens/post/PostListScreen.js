import { useEffect, useState } from "react"
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
import { useNavigation } from "@react-navigation/native"
import PostFormat from "../../components/PostFormat"
import { Server } from "@env"
import { useUser } from "../../auth/UserContext"

const PostListScreen = () => {
    const navigation = useNavigation()
    const { user } = useUser()

    const [posts, setPosts] = useState()
    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleNotificationButton = () => {
        navigation.navigate("Notification")
    }

    const handleDirectButton = () => {
        navigation.navigate("ChatList")
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

    const goToProfile = (userid) => {
        navigation.navigate('Profile', { userid })
    }

    const refresh = () => {
        setIsRefreshing(true)
        fetchPosts()
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    return (
        <SafeAreaView style={CONTAINER.container}>
            <View style={CONTAINER.header}>
                <Text style={TYPOGRAPHY.bigText}>포스트</Text>
                <TouchableOpacity
                    onPress={handleNotificationButton}
                >
                    <Octicons name="heart" size={26} color="#333333" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleDirectButton}
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
        </SafeAreaView>
    )
}

export default PostListScreen

const styles = StyleSheet.create({

})