import { useRef, useCallback, useState, useEffect } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert
} from "react-native"
import { CONTAINER, TYPOGRAPHY } from "../../styles/commonStyles"
import ImageCropPicker from "react-native-image-crop-picker"
import AntIcon from "react-native-vector-icons/AntDesign"
import Carousel from "react-native-reanimated-carousel"
import { useFocusEffect, useNavigation } from "@react-navigation/native"

const PHOTO_WIDTH = 350
const PHOTO_HEIGHT = 350

const ADD_PHOTO_ITEM = { type: 'add_photo' }

const PhotoSelectScreen = () => {
    const ref = useRef(null)

    const [selectedPhoto, setSelectedPhoto] = useState([])
    const [isSelected, setIsSelected] = useState(false)
    const navigation = useNavigation()

    const handleSelectPhoto = async () => {
        ImageCropPicker.openPicker({
            multiple: true,
            maxFiles: 10,
            mediaType: 'photo'
        }).then(photos => {
            const photoPaths = photos.map((photo) => photo.path)
            setSelectedPhoto((prevPhotos) => {
                const updatedPhotos = [
                    ...prevPhotos.filter(photo => photo !== ADD_PHOTO_ITEM),
                    ...photoPaths
                ]
                if (updatedPhotos.length < 10) {
                    updatedPhotos.push(ADD_PHOTO_ITEM)
                }
                return updatedPhotos
            })
            setIsSelected(true)
        }).catch(error => {
            console.log('사진 선택 실패:', error)
            if (error.code !== "E_PICKER_CANCELLED") {
                navigation.navigate("PostList")
            }
        })
    }

    const handleNext = () => {
        const photosWithoutAddButton = selectedPhoto.filter(
            (item) => item !== ADD_PHOTO_ITEM
        )
        if (photosWithoutAddButton.length > 0) {
            navigation.navigate("Caption", { selectedPhoto: photosWithoutAddButton })
            setSelectedPhoto([])
        } else {
            Alert.alert('사진을 선택해주세요.')
        }
    }

    const renderAddPhotoButton = () => {
        return (
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleSelectPhoto}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        )
    }

    const handleDeletedPhoto = (photoToDelete) => {
        setSelectedPhoto((prevPhotos) => 
            prevPhotos.filter((photo) => photo !== photoToDelete)
        )
    }

    const renderPhoto = (item) => {
        if (item === ADD_PHOTO_ITEM) {
            return renderAddPhotoButton()
        }
        return (
            <View>
                <Image source={{ uri: item }} style={styles.image} />
                <TouchableOpacity
                    onPress={() => handleDeletedPhoto(item)}
                >
                    <AntIcon name="closecircle" size={24} color='#777777' />
                </TouchableOpacity>
            </View>
        )
    }

    useFocusEffect(
        useCallback(() => {
            if (!isSelected) {
                handleSelectPhoto()
            }
        }, [isSelected])
    )

    useEffect(() => {
        if (selectedPhoto.length === 0) {
            handleSelectPhoto()
        }
    }, [selectedPhoto])

    return (
        <SafeAreaView style={CONTAINER.container}>
            <View style={CONTAINER.header}>
                {
                    selectedPhoto.length > 0 && (
                        <TouchableOpacity onPress={handleNext}>
                            <Text>다음</Text>
                        </TouchableOpacity>
                    )
                }
            </View>

            {
                selectedPhoto.length > 0 ? (
                    <Carousel
                        ref={ref}
                        mode="normal-horizontal"
                        loop={false}
                        width={PHOTO_WIDTH}
                        height={PHOTO_HEIGHT}
                        autoPlay={false}
                        data={selectedPhoto}
                        scrollAnimationDuration={600}
                        renderItem={({ item }) => renderPhoto(item)}
                    />
                ) : (
                    <View />
                )
            }
        </SafeAreaView>
    )
}

export default PhotoSelectScreen

const styles = StyleSheet.create({
    image: {
        width: PHOTO_WIDTH,
        height: PHOTO_HEIGHT
    },
    addButton: {
        width: PHOTO_WIDTH,
        height: PHOTO_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDDDDD'
    },
    addButtonText: {
        fontSize: 100,
        fontWeight: 'bold'
    }
})