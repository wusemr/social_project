import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native"
import Feather from "react-native-vector-icons/Feather"
import Octicons from "react-native-vector-icons/Octicons"
import { CONTAINER, TYPOGRAPHY } from "../../styles/commonStyles"
import { useNavigation } from "@react-navigation/native"

const PostListScreen = () => {
    const navigation = useNavigation()

    const handleNotificationButton = () => {
        navigation.navigate("Notification")
    }

    const handleDirectButton = () => {
        navigation.navigate("ChatList")
    }

    return (
        <SafeAreaView style={CONTAINER.container}>
            <View style={CONTAINER.header}>
                <Text style={TYPOGRAPHY.bigText}>포스트</Text>
                <TouchableOpacity
                    onPress={handleNotificationButton}
                >
                    <Octicons name="heart" size={26} color="#333333" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleDirectButton}
                >
                    <Feather name="send" size={26} color="#333333" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default PostListScreen

const styles = StyleSheet.create({

})