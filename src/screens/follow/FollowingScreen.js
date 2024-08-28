import { useEffect, useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    FlatList
} from "react-native"
import { Server } from "@env"
import FollowListItem from "../../components/FollowListItem"
import { CONTAINER, TYPOGRAPHY } from "../../styles/commonStyles"

const FollowingScreen = ({ route }) => {
    const { currentUser, targetUser } = route.params
    const [followingList, setFollowingList] = useState([])

    // 팔로잉 목록 불러오기
    const fetchFollowingList = async () => {
        try {
            const response = await fetch(`${Server}/user/get-list/following?currentUser=${currentUser}&targetUser=${targetUser}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('팔로잉 목록을 불러오는 중 오류가 발생했습니다.');
            }

            const data = await response.json();
            setFollowingList(data);
        } catch (error) {
            console.error('팔로잉 목록을 불러오는 중 오류가 발생했습니다.', error);
        }
    }

    // 팔로잉 목록의 각 항목 렌더링
    const renderItem = ({ item }) => (
        <FollowListItem
            currentUser={currentUser}
            profile_picture={item.profile_picture}
            username={item.username}
            userid={item.userid}
            isFollowing={item.isFollowing}
            onFollowToggle={() => handleFollowButton(item.userid, item.isFollowing)}
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

    // 타겟 유저가 바뀔 때마다 호출
    useEffect(() => {
        fetchFollowingList()
    }, [targetUser])

    return (
        <SafeAreaView style={CONTAINER.container}>
            <View style={[CONTAINER.header, { justifyContent: 'center', alignItems: 'center', height: '5%', marginBottom: 5 }]} >
                <Text style={TYPOGRAPHY.bigText}>팔로우</Text>
            </View>

            <View style={{ flex: 1 }}>
                <FlatList
                    data={followingList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
        </SafeAreaView>
    )
}

export default FollowingScreen