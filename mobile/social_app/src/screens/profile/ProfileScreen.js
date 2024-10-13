import { useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    Dimensions,
    ActivityIndicator,
    Image
} from "react-native"
import { CONTAINER, TYPOGRAPHY } from "../../styles/commonStyles"
import ProfileFormat from "../../components/ProfileFormat"
import { useUser } from "../../auth/UserContext"
import { Server } from "@env"

const { height } = Dimensions.get('window')

const ProfileScreen = ({ route }) => {
    const { userid } = route.params
    const { user } = useUser()
    const isFollowable = user !== userid
    const [isPhotoVisible, setIsPhotoVisible] = useState(false)
    const [profileUrl, setProfileUrl] = useState(null)
    const [loading, setLoading] = useState(false)

    // 프로필 사진 클릭 시 실행되는 함수
    const handlePressImage = () => {
        viewProfilePhoto(userid)
    }

    // 프로필 사진 보기
    const viewProfilePhoto = async (userid) => {
        setIsPhotoVisible(true);
        setLoading(true);

        try {
            const response = await fetch(`${Server}/user/get-profile/photo?userid=${userid}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('프로필 사진을 가져오는 데 실패했습니다.');
            }

            const data = await response.json();
            setProfileUrl(`${Server}/${data.profile_picture}`);
        } catch (error) {
            setIsPhotoVisible(false);
            console.error('프로필 사진을 조회하는 도중 오류가 발생했습니다.', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={CONTAINER.container}>
            <View style={styles.header}>
                <Text style={TYPOGRAPHY.bigText}>{userid}</Text>
            </View>

            <ProfileFormat
                handlePressImage={handlePressImage}
                userid={userid}
                isFollowable={isFollowable}
                user={user}
            />

            <Modal
                visible={isPhotoVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsPhotoVisible(false)}
                onTouchEnd={() => setIsPhotoVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsPhotoVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.imageContainer}>
                            {
                                loading ? (
                                    <ActivityIndicator size='large' color='#FFFFFF' />
                                ) : (

                                    <Image
                                        source={{ uri: profileUrl }}
                                        style={styles.image}
                                        resizeMethod="contain"
                                    />
                                )
                            }
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
    },
    modalOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000090'
    },
    imageContainer: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5
    },
    image: {
        width: height / 3,
        height: height / 3,
        borderRadius: 100000
    }
})