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
import { useUser } from "../../auth/UserContext"

const ProfileScreen = () => {
    const { user } = useUser()

    const handlePressImage = () => {

    }

    return (
        <SafeAreaView style={CONTAINER.container}>
            <View style={CONTAINER.header}>
                <Text style={TYPOGRAPHY.bigText}>{user}</Text>
                <TouchableOpacity>
                    <Feather name="menu" size={26} color='#555555' />
                </TouchableOpacity>
            </View>

            <ProfileFormat handlePressImage={handlePressImage} userid={user} />
        </SafeAreaView>
    )
}

export default ProfileScreen