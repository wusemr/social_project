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
import { Server } from "@env"
import { useUser } from "../../auth/UserContext"

const LoginScreen = () => {
    const navigation = useNavigation()
    const { login } = useUser()

    const [id, setId] = useState('')
    const [password, setPassword] = useState('')
    const [loginCheckLabel, setLoginCheckLabel] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const keyboardOff = () => {
        Keyboard.dismiss()
    }

    const handleLoginButton = async () => {
        if (!id || !password) {
            setLoginCheckLabel('로그인 정보를 모두 입력해주세요.');
        }

        try {
            const response = await fetch(`${Server}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid: id, password })
            });

            if (response.status === 404) {
                setLoginCheckLabel('존재하지 않는 아이디입니다.');
            } else if (response.status === 401) {
                setLoginCheckLabel('비밀번호가 일치하지 않습니다.');
            } else if (response.status === 200) {
                const {userid} = await response.json()
                console.log(userid)
                await login(userid)
                navigation.navigate('MainTab');
                setId('');
                setPassword('');
                setLoginCheckLabel('');
            }
        } catch (error) {
            console.error('[로그인] 서버 요청 중 오류가 발생했습니다.', error);
        }
    }

    const handleSignUpButton = () => {
        setId('')
        setPassword('')
        setLoginCheckLabel('')
        navigation.navigate("SignUp")
    }

    const handleFindAuth = () => {
        setId('')
        setPassword('')
        setLoginCheckLabel('')
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

            <Text style={TYPOGRAPHY.smallText}>{loginCheckLabel}</Text>

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