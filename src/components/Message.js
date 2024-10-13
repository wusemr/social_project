import {
    View,
    Text,
    StyleSheet
} from "react-native"

export const UserMessage = ({ message }) => {
    return (
        <View style={[styles.container, { backgroundColor: '#E1E1E1', alignSelf: 'flex-end' }]}>
            <Text style={styles.text}>{message}</Text>
        </View>
    )
}

export const OtherMessage = ({ message }) => {
    return (
        <View style={[styles.container, { backgroundColor: '#F9F9F9', alignSelf: 'flex-start' }]}>
            <Text style={styles.text}>{message}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 30,
        padding: 10,
        marginBottom: 10,
        maxWidth: '80%'
    },
    text: {
        fontSize: 16,
        color: '#333333'
    }
})