import {
    SafeAreaView,
    View,
    Text,
    StyleSheet
} from "react-native"
import { CONTAINER, TYPOGRAPHY } from "../../styles/commonStyles"
import ProfileFormat from "../../components/ProfileFormat"
import { useUser } from "../../auth/UserContext"
import { Server } from "@env"

const ProfileScreen = ({ route }) => {
    const { userid } = route.params
    const { user } = useUser()
    const isFollowable = user !== userid

    // 프로필 사진 클릭 시 실행되는 함수
    const handlePressImage = () => {

    }

    // 프로필 사진 보기
    const viewProfilePhoto = () => {

    }

    // 
    return (
        <SafeAreaView style={CONTAINER.container}>
            <View style={styles.header}>
                <Text style={TYPOGRAPHY.bigText}>{userid}</Text>
            </View>

            <ProfileFormat handlePressImage={handlePressImage} userid={userid} isFollowable={isFollowable} user={user} />
        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        height: '5%',
        alignItems: 'center',
        backgroundColor: '#00000020',
        justifyContent: 'center'
    }
})