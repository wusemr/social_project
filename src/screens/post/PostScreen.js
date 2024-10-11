import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    Modal,
} from "react-native"
import PostFormat from "../../components/PostFormat"
import { CONTAINER, TYPOGRAPHY } from "../../styles/commonStyles"
import Octicons from 'react-native-vector-icons/Octicons'
import { Server } from "@env"
import { useNavigation } from "@react-navigation/native"
import CommentScreen from "./CommentScreen"
import BottomSheet from "@gorhom/bottom-sheet"

const PostScreen = ({ route }) => {
    const navigation = useNavigation()

    const { currentUser, post_id } = route.params
    const [post, setPost] = useState(null)
    const [liked, setLiked] = useState(false)

    const bottomSheetRef = useRef(null)
    const snapPoints = useMemo(() => ['70%'], [])

    const [commentVisible, setCommentVisible] = useState(false)

    const handleSheetChanges = useCallback((index) => {
        if (index === -1) {
            setCommentVisible(false)
        }
    }, [])

    const handleOpenComments = () => {
        setCommentVisible(true)
        bottomSheetRef.current?.snapToIndex(0)
    }

    const handleCloseComments = () => {
        bottomSheetRef.current?.close()
    }

    const fetchPost = async () => {
        try {
            console.log('실행즁~')
            const response = await fetch(`${Server}/post/get-one?currentUser=${currentUser}&postid=${post_id}`);
            console.log('보냈는디 요청')
            const data = await response.json();

            console.log('gpgpgpgpgp받아온거', data);
            setPost({
                post_id: data.post_id,
                content: data.content,
                created_at: data.created_at,
                userid: data.userid,
                username: data.username,
                profile_picture: data.profile_picture,
                images: data.images,
                isLiked: data.isLiked,
                commentCount: data.commentCount,
                likeCount: data.likeCount
            });
            setLiked(data.isLiked);
        } catch (error) {
            console.error('게시물 데이터를 가져오는 중 오류가 발생했습니다.:', error);
        }
    }

    const handleLike = async () => {
        try {
            const response = await fetch(`${Server}/post/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser, postId: post_id })
            });

            if (response.ok) {
                setPost((prevPost) => ({
                    ...prevPost,
                    isLiked: !prevPost.isLiked,
                    likeCount: prevPost.isLiked ? prevPost.likeCount - 1 : prevPost.likeCount + 1
                }));
                setLiked((prev) => !prev);
            } else {
                console.error('좋아요 요청 실패:', await response.text());
            }
        } catch (error) {
            console.error('좋아요 처리 중 오류가 발생했습니다.', error);
        }
    }

    const viewLikeList = async () => {
        try {
            const response = await fetch(`${Server}/user/get-list/like?postId=${post_id}&currentUser=${currentUser}`);
            const likedUsers = await response.json();

            if (response.ok) {
                console.log('받아온 좋아요 누른 사람 목록', likedUsers);
                navigation.navigate('LikeList', { currentUser: currentUser, likedUsers });
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

    useEffect(() => {
        fetchPost()
    }, [])

    return (
        <SafeAreaView style={CONTAINER.container}>
            <View style={[CONTAINER.header, { flexDirection: 'row' }]}>
                <Octicons name="chevron-left" size={24} color='#333333' />
                <Text>게시물</Text>
            </View>

            {
                post && (
                    <PostFormat
                        profilePic={{ uri: post.profile_picture }}
                        userid={post.userid}
                        postImages={post.images.map(image => ({ uri: image }))}
                        likeCount={Number(post.likeCount)}
                        caption={post.content}
                        commentCount={Number(post.commentCount)}
                        postId={post.post_id}
                        handleLike={() => handleLike(post.post_id)}
                        isLiked={post.isLiked}
                        viewLikeList={() => viewLikeList(post.post_id)}
                        goToProfile={() => goToProfile(post.userid)}
                        viewComments={handleOpenComments}
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
                <CommentScreen currentUser={currentUser} postId={post_id} />
            </BottomSheet>

        </SafeAreaView>
    )
}

export default PostScreen