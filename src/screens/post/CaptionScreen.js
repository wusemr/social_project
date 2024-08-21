import { useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    Modal,
    Alert
} from "react-native"
import { CONTAINER, TYPOGRAPHY, INPUT } from "../../styles/commonStyles"
import { useNavigation } from "@react-navigation/native"
import Carousel from "react-native-reanimated-carousel"
import { Server } from "@env"
import { useUser } from "../../auth/UserContext"

const PHOTO_WIDTH = 350
const PHOTO_HEIGHT = 350

const CaptionScreen = ({ route }) => {
    const navigation = useNavigation()
    const { user } = useUser()
    const { selectedPhoto } = route.params
    const [content, setContent] = useState('')
    const [modalVisible, setModalVisible] = useState(false)

    const handleUploadButton = async () => {
        if (selectedPhoto.length === 0) {
            Alert.alert('업로드 실패', '업로드할 사진이 존재하지 않습니다.');
            return;
        }

        const formData = new FormData();
        formData.append('content', content);
        formData.append('userid', user);

        selectedPhoto.forEach((photoUri, index) => {
            const photoType = photoUri.split('.').pop();
            const mimeTypes = {
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png'
            };
            const photoMimeType = mimeTypes[photoType] || 'image/jpeg';

            formData.append('photos', {
                uri: photoUri,
                type: photoMimeType,
                name: `photo-${index + 1}.${photoType}`
            });
        });

        try {
            const response = await fetch(`${Server}/post/upload`, {
                method: 'POST',
                body: formData
            });
            console.log('일단 요청하긴 했어~')
            if (!response.ok) {
                throw new Error('서버 오류: 게시물 업로드에 실패했습니다.');
            }

            const result = await response.json();
            console.log('게시물 업로드 성공:', result);
            navigation.navigate('PostList');
        } catch (error) {
            console.error('게시물 업로드 중 오류가 발생했습니다.', error);
        } finally {
            setContent('');
            setModalVisible(false);
        }
    }

    const toggleModal = () => {
        setModalVisible(!modalVisible)
    }

    if (selectedPhoto.length === 0) {
        return (
            <SafeAreaView style={CONTAINER.container}>
                <View style={CONTAINER.header}>
                    <Text>사진이 음슴!</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={CONTAINER.container}>
            <View style={CONTAINER.header}>
                <TouchableOpacity
                    onPress={handleUploadButton}
                >
                    <Text style={TYPOGRAPHY.smallText}>등록</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.area}>
                <TouchableOpacity onPress={toggleModal}>
                    <Image source={{ uri: selectedPhoto[0] }} style={{ width: 140, height: 140 }} />
                </TouchableOpacity>

                <View style={styles.right}>
                    <TextInput
                        value={content}
                        onChangeText={setContent}
                        style={INPUT.textArea}
                        multiline={true}
                    />
                </View>
            </View>

            <Modal
                visible={modalVisible}
                transparent={true}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    onPress={toggleModal}
                    activeOpacity={1}
                >
                    <View style={styles.carouselContainer}>
                        <Carousel
                            mode="normal-horizontal"
                            loop={false}
                            width={PHOTO_WIDTH}
                            height={PHOTO_HEIGHT}
                            autoPlay={false}
                            data={selectedPhoto}
                            scrollAnimationDuration={600}
                            renderItem={({ item }) => (
                                <Image source={{ uri: item }} style={styles.carouselImage} />
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    )
}

export default CaptionScreen

const styles = StyleSheet.create({
    area: {
        flexDirection: 'row',
        height: 140
    },
    right: {
        width: '60%'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#00000060',
        justifyContent: 'center',
        alignItems: 'center'
    },
    carouselContainer: {
        width: PHOTO_WIDTH,
        height: PHOTO_HEIGHT,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    carouselImage: {
        width: PHOTO_WIDTH,
        height: PHOTO_HEIGHT,
    }
})