import { useRef } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Alert
} from "react-native"
import { CONTAINER, TYPOGRAPHY } from "../../styles/commonStyles"
import Feather from "react-native-vector-icons/Feather"
import ProfileFormat from "../../components/ProfileFormat"
import { useUser } from "../../auth/UserContext"
import ActionSheet from "react-native-actionsheet"
import ImageCropPicker from "react-native-image-crop-picker"
import { Server } from "@env"

const options = ['프로필 사진 보기', '프로필 사진 변경', '삭제', '취소']

const MyProfileScreen = () => {
    const { user } = useUser()
    const actionSheetRef = useRef(null)

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

            <ProfileFormat handlePressImage={handlePressImage} userid={user} isFollowable={false} user={user} />

            <ActionSheet
                ref={actionSheetRef}
                title='프로필 사진'
                options={options}
                cancelButtonIndex={3}
                destructiveButtonIndex={2}
                onPress={handleActionSheet}
            />
        </SafeAreaView>
    )
}

export default MyProfileScreen