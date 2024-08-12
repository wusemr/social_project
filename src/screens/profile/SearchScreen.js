import { useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native"
import { CONTAINER, TYPOGRAPHY } from "../../styles/commonStyles"
import Feather from "react-native-vector-icons/Feather"
const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [isFocused, setIsFocused] = useState(false)

    const keyboardOff = () => {
        Keyboard.dismiss()
    }

    const handleSearchButton = () => {
        console.log('검색어:', searchQuery)
        // 추후 검색 로직 추가 필요
    }

    const handleCancel = () => {
        setSearchQuery('')
        setIsFocused(false)
        keyboardOff()
    }

    return (
        <TouchableWithoutFeedback onPress={keyboardOff}>
            <SafeAreaView style={CONTAINER.container}>
                <View style={styles.searchContainer}>
                    <Feather name="search" size={24} color='#666666' />
                    <TextInput
                        value={searchQuery}
                        style={[styles.input, isFocused && styles.inputFocused]}
                        onChangeText={setSearchQuery}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        returnKeyType="검색"
                        onSubmitEditing={handleSearchButton}
                    />
                    {
                        isFocused && (
                            <TouchableOpacity onPress={handleCancel}>
                                <Text style={TYPOGRAPHY.smallText}>취소</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default SearchScreen

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: '#00000010',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    input: {
        backgroundColor: '#00000015',
        fontSize: 18,
        padding: 5,
        width: "90%",
        color: "#333333"
    },
    inputFocused: {
        width: "80%"
    }
})