import { useRef, useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Alert,
    Modal,
    Image,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    TouchableWithoutFeedback
} from "react-native"
import { CONTAINER, TYPOGRAPHY } from "../../styles/commonStyles"
import Feather from "react-native-vector-icons/Feather"
import ProfileFormat from "../../components/ProfileFormat"
import { useUser } from "../../auth/UserContext"
import ActionSheet from "react-native-actionsheet"
import ImageCropPicker from "react-native-image-crop-picker"
import { Server } from "@env"

const { height } = Dimensions.get('window')
const options = ['프로필 사진 보기', '프로필 사진 변경', '삭제', '취소']

const MyProfileScreen = () => {
    const { user } = useUser()
    const actionSheetRef = useRef(null)
    const [refreshProfile, setRefreshProfile] = useState(false)
    const [isPhotoVisible, setIsPhotoVisible] = useState(false)
    const [profileUrl, setProfileUrl] = useState(null)
    const [loading, setLoading] = useState(false)

    // 프로필 사진 클릭 시 실행되는 함수
    const handlePressImage = () => {
        actionSheetRef.current.show()
    }

    // 프로필 사진 클릭 시 나타나는 액션 시트
    const handleActionSheet = (index) => {
        switch (index) {
            case 0:
                viewProfilePhoto()
                break
            case 1:
                handleSelectPhoto()
                break
            case 2:
                deleteProfilePhoto()
                break
            default:
                break
        }
    }

    // 프로필 사진 보기
    const viewProfilePhoto = async () => {
        setIsPhotoVisible(true);
        setLoading(true);

        try {
            const response = await fetch(`${Server}/user/get-profile/photo?userid=${user}`, {
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

    // 프로필 사진 선택
    const handleSelectPhoto = async () => {
        ImageCropPicker.openPicker({
            cropping: true,
            cropperCircleOverlay: true,
            cropperChooseText: '확인',
            cropperCancelText: '취소',
            cropperToolbarTitle: '사진 자르기',
            width: 300,
            height: 300
        }).then(photo => {
            console.log('선택된 사진:', photo)
            updateProfilePhoto(photo)
        }).catch(error => {
            console.error('사진 선택 오류:', error)
        })
    }

    // 프로필 사진 변경
    const updateProfilePhoto = async (photo) => {
        const formData = new FormData();
        formData.append('photo', {
            uri: photo.path,
            type: photo.mime,
            name: 'profile.jpg'
        });
        formData.append('userid', user);

        try {
            const response = await fetch(`${Server}/user/update-profile/photo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                console.log('프로필 사진 URL:', data.profilePhotoUrl);
                setRefreshProfile(true);
            } else {
                console.log('프로필 사진 업데이트 오류');
                Alert.alert('프로필 사진 변경에 실패하였습니다.');
            }
        } catch (error) {
            Alert.alert('업데이트 오류', '프로필 사진 업데이트 중 오류가 발생했습니다.');
            console.error('프로필 사진 업데이트 오류:', error);
        }
    }

    // 프로필 사진 삭제
    const deleteProfilePhoto = async () => {
        try {
            const response = await fetch(`${Server}/user/delete-profile/photo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userid: user })
            });

            if (response.ok) {
                console.log('프로필 사진 삭제 완료');
                setRefreshProfile(true);
            } else {
                Alert.alert('프로필 사진 삭제에 실패하였습니다.');
            }
        } catch (error) {
            Alert.alert('삭제 오류', '프로필 사진 삭제 중 오류가 발생했습니다.');
            console.error('프로필 사진 삭제 오류:', error);
        }
    }

    return (
        <SafeAreaView style={CONTAINER.container}>
            <View style={CONTAINER.header}>
                <Text style={TYPOGRAPHY.bigText}>{user}</Text>
                <TouchableOpacity>
                    <Feather name="menu" size={26} color='#555555' />
                </TouchableOpacity>
            </View>

            <ProfileFormat
                handlePressImage={handlePressImage}
                userid={user}
                isFollowable={false}
                user={user}
                refreshProfile={refreshProfile}
                setRefreshProfile={setRefreshProfile}
            />

            <ActionSheet
                ref={actionSheetRef}
                title='프로필 사진'
                options={options}
                cancelButtonIndex={3}
                destructiveButtonIndex={2}
                onPress={handleActionSheet}
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

export default MyProfileScreen

const styles = StyleSheet.create({
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