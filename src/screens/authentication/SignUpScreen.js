import { useState, useEffect } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import FeatherIcon from "react-native-vector-icons/Feather"
import { validateUsername, validateId, validatePassword } from "../../components/validateString"
import { CONTAINER, TYPOGRAPHY, BUTTONS, COLOR, SHADOWS, BUTTON } from "../../styles/commonStyles"

const SignUpScreen = () => {
    const navigation = useNavigation()

    const [username, setUsername] = useState('')
    const [id, setId] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isPasswordMatched, setIsPasswordMatched] = useState(false)

    const [availableId, setAvailableId] = useState(false)
    const [availableIdText, setAvailableIdText] = useState('아이디 중복 여부를 확인해주세요.')
    const [availableIdColor, setAvailableIdColor] = useState('#AAAAAA')

    const [unPlaceholder, setUnPlaceholder] = useState('이름')
    const [idPlaceholder, setIdPlaceholder] = useState('아이디')
    const [pwPlaceholder, setPwPlaceholder] = useState('비밀번호')
    const [cpwPlaceholder, setCpwPlaceholder] = useState('비밀번호 확인')

    const clearAll = () => {
        setUsername('')
        setId('')
        setPassword('')
        setConfirmPassword('')
    }

    const handleCheckId = () => {
        if (id == '') {
            setIdPlaceholder('아이디를 먼저 입력하세요.')
            return
        } else if (!validateId(id)) {
            setIdPlaceholder('영어, 숫자, 특수문자(._) 입력 가능')
            setId('')
            return
        } else {
            // if () {    // 존재하는 아이디인 경우
            //     setAvailableIdText('이미 사용 중인 아이디입니다.')
            //     setAvailableIdColor('#DB0000')
            // } else {    // 사용 가능한 아이디인 경우
            //     setAvailableIdText('사용 가능한 아이디입니다.')
            //     setAvailableIdColor('#000AC9')
            setAvailableId(true)
            // }

        }
    }

    const handleSignUpButton = () => {
        if (!username || !id || !password || !confirmPassword) {
            Alert.alert('모든 정보를 입력해주세요.')
            return
        }

        if (!availableId) {
            Alert.alert('유효하지 않은 아이디입니다.')
            return
        }

        if (!validateUsername(username)) {
            Alert.alert('유효하지 않은 사용자 이름입니다.')
            return
        }

        if (!validatePassword(password)) {
            Alert.alert('유효하지 않은 비밀번호입니다.')
            return
        }

        if (password !== confirmPassword) {
            Alert.alert('비밀번호가 일치하지 않습니다.')
            return
        }

        navigation.navigate("Login")
        clearAll()
    }

    useEffect(() => {
        setIsPasswordMatched(password === confirmPassword && password.length > 0)
    }, [password, confirmPassword])

    return (
        <SafeAreaView style={CONTAINER.container}>
            <View style={styles.inputContainer}>
                <FeatherIcon name="edit-2" size={24} color='#555555' />
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    placeholder={unPlaceholder}
                    placeholderTextColor={COLOR.placeholder}
                />
            </View>

            <View style={styles.inputContainer}>
                <FeatherIcon name="user" size={24} color='#555555' />
                <TextInput
                    value={id}
                    onChangeText={setId}
                    style={styles.input}
                    placeholder={idPlaceholder}
                    placeholderTextColor={COLOR.placeholder}
                />
                <TouchableOpacity
                    onPress={handleCheckId}
                >
                    <Text style={TYPOGRAPHY.smallText}>확인</Text>
                </TouchableOpacity>
            </View>

            <Text style={[TYPOGRAPHY.smallText, { color: availableIdColor }]}>{availableIdText}</Text>

            <View style={styles.inputContainer}>
                <FeatherIcon name="lock" size={24} color='#555555' />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    placeholder={pwPlaceholder}
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

            <View style={styles.inputContainer}>
                <FeatherIcon name="check-square" size={24} color='#555555' />
                <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={styles.input}
                    placeholder={cpwPlaceholder}
                    placeholderTextColor={COLOR.placeholder}
                    secureTextEntry={true}
                />
                <FeatherIcon name="check" size={24} color={isPasswordMatched ? '#5BBC00' : '#555555'} />
            </View>

            <TouchableOpacity
                style={BUTTONS.primary}
                onPress={handleSignUpButton}
            >
                <Text style={TYPOGRAPHY.buttonText}>회원가입</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default SignUpScreen

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
    }
})