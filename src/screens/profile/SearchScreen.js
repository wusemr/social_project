import { useEffect, useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    FlatList,
    Image
} from "react-native"
import { CONTAINER, TYPOGRAPHY } from "../../styles/commonStyles"
import Feather from "react-native-vector-icons/Feather"
import { Server } from "@env"

const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [isFocused, setIsFocused] = useState(false)

    const keyboardOff = () => {
        Keyboard.dismiss()
    }

    const handleSearchButton = () => {
        fetchSearchResults()
    }

    const handleCancel = () => {
        setSearchQuery('')
        setIsFocused(false)
        keyboardOff()
    }

    const fetchSearchResults = async () => {
        if (searchQuery.trim().length > 0) {
            try {
                const response = await fetch(`${Server}/user/search?query=${searchQuery}`);
                const data = await response.json();
                setSearchResult(data);
            } catch (error) {
                console.error('검색 오류:', error);
            }
        } else {
            setSearchResult([]);
        }
    }

    const renderSearchItem = ({ item }) => (
        <TouchableOpacity>
            <View style={styles.searchItem}>
                <Image source={{ uri: `${Server}/${item.profile_picture}` }} style={styles.photo} />
                <Text style={[TYPOGRAPHY.normalText, { marginLeft: 10, fontWeight: '500' }]}>{item.userid}</Text>
            </View>
        </TouchableOpacity>
    )

    useEffect(() => {
        fetchSearchResults()
    }, [searchQuery])

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

                <FlatList
                    data={searchResult}
                    keyExtractor={(item) => item.userid}
                    renderItem={renderSearchItem}
                    style={styles.searchResultList}
                />
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
    },
    searchItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd',
        alignItems: 'center'
    },
    searchResultList: {
        marginBottom: 10
    },
    photo: {
        width: 35,
        height: 35,
        borderRadius: 100
    }
})