import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from "react-native"
import { Server } from "@env"
import { TYPOGRAPHY } from "../styles/commonStyles"

const { height } = Dimensions.get('screen')
const { width } = Dimensions.get('window')

const FollowListItem = (props) => {
    const { currentUser, profile_picture, username, userid, isFollowing, onFollowToggle } = props

    return (
        <View style={styles.item}>
            <TouchableOpacity style={styles.container}>
                <Image
                    source={{ uri: `${Server}/${profile_picture}` }}
                    style={styles.photo}
                />
                <View style={styles.infoContainer}>
                    <Text style={[TYPOGRAPHY.normalText, { fontWeight: '500' }]}>{userid}</Text>
                    <Text style={[TYPOGRAPHY.smallText, { fontSize: 15 }]}>{username}</Text>
                </View>
            </TouchableOpacity>

            {
                currentUser !== userid && (
                    <TouchableOpacity
                        style={[styles.followButton, isFollowing ? styles.following : styles.notFollowing]}
                        onPress={onFollowToggle}
                    >
                        <Text style={TYPOGRAPHY.buttonText}>
                            {isFollowing ? '팔로잉' : '팔로우'}
                        </Text>
                    </TouchableOpacity>
                )
            }
        </View>
    )
}

export default FollowListItem

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        justifyContent: 'space-between'
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    photo: {
        width: width / 8,
        height: width / 8,
        borderRadius: 100
    },
    infoContainer: {
        marginLeft: 10
    },
    followButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        width: width / 4.5,
        height: height / 25,
        borderRadius: 10
    },
    following: {
        backgroundColor: '#00000040'
    },
    notFollowing: {
        backgroundColor: '#005DFF'
    }
})