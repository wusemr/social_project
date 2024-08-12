import { useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Keyboard
} from "react-native"
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import FeatherIcon from "react-native-vector-icons/Feather"
import { CONTAINER, TYPOGRAPHY, BUTTONS, COLOR, SHADOWS, BUTTON } from "../../styles/commonStyles"
import { useNavigation } from "@react-navigation/native"

const LoginScreen = () => {
    const navigation = useNavigation()

    const [id, setId] = useState('')
    const [password, setPassword] = useState('')
    const [loginCheckLabel, setLoginCheckLabel] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const keyboardOff = () => {
        Keyboard.dismiss()
    }

    const handleLoginButton = () => {
        const checkLogin = () => {
            // 로그인이 실패하면
            // 1. 존재하지 않는 아이디입니다.
            // 2. 비밀번호가 맞지 않습니다.
            // 둘 중 하나 반환
            // 그리고 return false
            return true
        }

        if (!checkLogin) {
            setLoginCheckLabel()
        } else {
            navigation.navigate("MainTab")
            setId('')
            setPassword('')
        }
    }

    const handleSignUpButton = () => {
        navigation.navigate("SignUp")
    }

    const handleFindAuth = () => {
        navigation.navigate("FindAuth")
    }
    
    return (
        <SafeAreaView style={CONTAINER.container}>
            {/* App LOGO */}
            <Text style={styles.title}>Instagram Clone</Text>

            <View style={styles.inputContainer}>
                <FeatherIcon name="user" size={24} color='#555555' />
                <TextInput
                    value={id}
                    onChangeText={setId}
                    style={styles.input}
                    placeholder="아이디"
                    placeholderTextColor={COLOR.placeholder}
                />
            </View>

            <View style={styles.inputContainer}>
                <FeatherIcon name="lock" size={24} color='#555555' />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    placeholder="비밀번호"
                    placeholderTextColor={COLOR.placeholder}
                    secureTextEntry={!showPassword}
                />

                <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <MaterialIcon name={showPassword ? "visibility" : "visibility-off"} size={24} color='#555555' />
                </TouchableOpacity>

            </View>

            <TouchableOpacity
                style={BUTTONS.second}
                onPress={handleFindAuth}
            >
                <Text style={TYPOGRAPHY.smallText}>계정 찾기</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={BUTTONS.primary}
                onPress={handleLoginButton}
            >
                <Text style={TYPOGRAPHY.buttonText}>로그인</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleSignUpButton}
            >
                <Text style={TYPOGRAPHY.smallText}>회원가입</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: '#00000010',
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        backgroundColor: '#00000015',
        fontSize: 18,
        padding: 5,
        width: "70%",
        color: "#333333"
    },
    eyeButton: {

    }
})