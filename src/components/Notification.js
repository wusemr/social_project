import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet
} from "react-native"

const Notification = ({ image, content, time }) => {
    return (
        <TouchableOpacity
            style={styles.notification}
        >
            <Image source={image} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={[styles.contentFont, { fontWeight: 'bold' }]}>wusemr2</Text>
                <Text style={styles.contentFont}>님이 {content}</Text>
                <Text style={styles.timeFont}>{time}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default Notification

const styles = StyleSheet.create({
    notification: {
        backgroundColor: '#00000010',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 100,
        marginRight: 5
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    contentFont: {
        marginLeft: 3,
        fontSize: 15,
        color: '#333333',
        fontWeight: '400'
    },
    timeFont: {
        fontSize: 15,
        marginLeft: 5,
        color: '#777777'
    }
})