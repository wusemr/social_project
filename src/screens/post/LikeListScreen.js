import { useEffect, useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    FlatList
} from "react-native"
import LikeListItem from "../../components/LikeListItem"
import { CONTAINER, TYPOGRAPHY } from "../../styles/commonStyles"

const LikeListScreen = ({ route }) => {
    const { currentUser, likedUsers } = route.params
    const [likeList, setLikeList] = useState([])

    const sortedLikeList = likedUsers.sort((a, b) => {
        if (a.userid === currentUser) return -1
        if (b.userid === currentUser) return 1
        return 0
    })

    useEffect(() => {
        setLikeList(sortedLikeList)
    }, [likedUsers])

    // 팔로잉 목록의 각 항목 렌더링
    const renderItem = ({ item }) => (
        <LikeListItem
            currentUser={currentUser}
            profile_picture={item.profile_picture}
            username={item.username}
            userid={item.userid}
            isFollowing={item.is_following}
            onFollowToggle={() => handleFollowButton(item.userid, item.is_following)}
        />
    )

    // 팔로우&팔로잉 버튼 클릭 시 실행되는 함수
    const handleFollowButton = async (userid, isFollowing) => {
        const target = userid;

        try {
            const endpoint = isFollowing ? `${Server}/user/unfollow` : `${Server}/user/follow`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid: currentUser, following_id: target })
            });

            if (!response.ok) {
                throw new Error('팔로우 상태를 변경하는 중 오류가 발생했습니다.');
            }

            fetchFollowingList();
        } catch (error) {
            console.error('팔로우 상태를 변경하는 중 오류가 발생했습니다.', error);
        }
    }

    return (
        <SafeAreaView style={CONTAINER.container}>
            <View style={[CONTAINER.header, { justifyContent: 'center', alignItems: 'center', height: '5%', marginBottom: 5 }]} >
                <Text style={TYPOGRAPHY.bigText}>좋아요</Text>
            </View>

            <View style={{ flex: 1 }}>
                <FlatList
                    data={likeList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
        </SafeAreaView>
    )
}

export default LikeListScreen