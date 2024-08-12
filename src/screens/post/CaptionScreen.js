import { useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    Modal
} from "react-native"
import { CONTAINER, TYPOGRAPHY, INPUT } from "../../styles/commonStyles"
import { useNavigation } from "@react-navigation/native"
import Carousel from "react-native-reanimated-carousel"

const PHOTO_WIDTH = 350
const PHOTO_HEIGHT = 350

const CaptionScreen = ({ route }) => {
    const navigation = useNavigation()
    const { selectedPhoto } = route.params
    const [content, setContent] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    
    const handleUploadButton = () => {
        navigation.navigate("PostList")
        setContent('')
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