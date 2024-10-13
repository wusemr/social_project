import { useEffect, useState } from "react"
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TextInput
} from "react-native"
import Comment from "../../components/Comment"
import Octicons from "react-native-vector-icons/Octicons"
import { Server } from "@env"

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('screen')

const CommentScreen = ({ currentUser, postId }) => {
    const [newComment, setNewComment] = useState('')
    const [commentList, setCommentList] = useState([])

    const fetchComments = async () => {
        try {
            const response = await fetch(`${Server}/comment/get-comments?postId=${postId}&userId=${currentUser}`);
            const data = await response.json();
            console.log(data);
            if (data.success) {
                setCommentList(data.comments);
            }
        } catch (error) {
            console.error('댓글을 불러오는 도중 오류가 발생했습니다.', error);
        }
    }

    const handleAddComment = async () => {
        if (newComment.trim() === '') return;

        try {
            const response = await fetch(`${Server}/comment/add-comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser, postId: postId, content: newComment })
            });

            const data = await response.json();

            if (data.success) {
                setCommentList([...commentList, data.comment]);
                setNewComment('');
                fetchComments();
            }
        } catch (error) {
            console.error('댓글을 작성하는 도중 오류가 발생했습니다.', error);
        }
    }

    // 좋아요 처리
    const handleLike = async (commentId) => {
        console.log('id', commentId, '번 댓글 좋아요 눌림')
        try {
            const response = await fetch(`${Server}/comment/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser, commentId: commentId })
            });

            const data = await response.json();

            if(data.success) {
                setCommentList(commentList.map(comment =>
                    comment.id === commentId ? { ...comment, is_liked: data.liked, like_count: data.liked ? comment.like_count + 1 : comment.like_count -1} : comment
                ));
            }
        } catch (error) {
            console.error('좋아요 처리 중 오류가 발생했습니다.', error);
        }
    }

    useEffect(() => {
        fetchComments()
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
                data={commentList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Comment
                        profile_picture={{ uri: item.profile_picture }}
                        userId={item.userid}
                        createdAt={item.created_at}
                        content={item.content}
                        replyCount={item.replyCount}
                        onReplyPress={() => console.log(`${item.post_id}번째 게시물의 ${item.id}번째 댓글에 답글달기를 시도했습니다.`)}
                        onLikePress={() => handleLike(item.id)}
                        likeCount={item.like_count}
                        isLiked={item.liked}
                    />
                )}
                ListFooterComponent={<View style={styles.footerSpace} />}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="댓글을 입력하세요."
                    value={newComment}
                    onChangeText={setNewComment}
                />
                <TouchableOpacity onPress={handleAddComment}>
                    <Octicons name="arrow-up" size={24} color='#555555' />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CommentScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        padding: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 5,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#F9F9F9',
        marginBottom: height / 50
    },
    textInput: {
        width: width - (width / 5),
        height: height / 20,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: width / 30,
        backgroundColor: '#FFFFFF',
        fontSize: 15
    },
    footerSpace: {
        height: height / 20
    }
})