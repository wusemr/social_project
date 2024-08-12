import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Image
} from "react-native"
import { CONTAINER, TYPOGRAPHY } from "../../styles/commonStyles"
import Feather from "react-native-vector-icons/Feather"
import ProfileFormat from "../../components/ProfileFormat"

const ProfileScreen = () => {
    const handlePressImage = () => {

    }

    return (
        <SafeAreaView style={CONTAINER.container}>
            <View style={CONTAINER.header}>
                <Text style={TYPOGRAPHY.bigText}>사용자이름</Text>
                <TouchableOpacity>
                    <Feather name="menu" size={26} color='#555555' />
                </TouchableOpacity>
            </View>

            <ProfileFormat handlePressImage={handlePressImage} />
        </SafeAreaView>
    )
}

export default ProfileScreen