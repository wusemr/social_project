import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    FlatList,
    Dimensions
} from "react-native"
import Ionicon from "react-native-vector-icons/Ionicons"

const {width} = Dimensions.get('window')
const numColumns = 3
const itemSize = (width - 30) / numColumns

const posts = [
    { id: '1', image: require('../images/Sample01.jpeg') },
    { id: '2', image: require('../images/Sample02.jpeg') },
    { id: '3', image: require('../images/Sample03.jpeg') },
    { id: '4', image: require('../images/Sample04.jpeg') },
    { id: '5', image: require('../images/Sample01.jpeg') },
    { id: '6', image: require('../images/Sample01.jpeg') },
    { id: '7', image: require('../images/Sample01.jpeg') },
    { id: '8', image: require('../images/Sample01.jpeg') },
    { id: '9', image: require('../images/Sample01.jpeg') },
    { id: '10', image: require('../images/Sample01.jpeg') },
    { id: '11', image: require('../images/Sample01.jpeg') },
    { id: '12', image: require('../images/Sample01.jpeg') },
    { id: '13', image: require('../images/Sample01.jpeg') },
    { id: '14', image: require('../images/Sample01.jpeg') },
]

const ProfileFormat = (props) => {

    const renderPost = ({ item }) => {
        return (
            <TouchableOpacity
            style={styles.postItem}
            onPress={() => console.log(`Pressed post with id: ${item.id}`)}
            >
                <Image source={item.image} style={styles.postImage} />
            </TouchableOpacity>
        )
    }

    return (
        <>
            <View style={styles.profileContainer}>
                <View style={styles.infoContainer}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={props.handlePressImage}
                    >
                        <Image
                            source={require('../images/profile.jpeg')}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.infoTextContainer}
                    >
                        <Text style={[styles.infoText, { fontWeight: '600' }]}>0</Text>
                        <Text style={styles.infoText}>게시물</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.infoTextContainer}
                    >
                        <Text style={[styles.infoText, { fontWeight: '600' }]}>0</Text>
                        <Text style={styles.infoText}>팔로워</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.infoTextContainer}
                    >
                        <Text style={[styles.infoText, { fontWeight: '600' }]}>0</Text>
                        <Text style={styles.infoText}>팔로잉</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <Text style={[styles.infoText, { fontWeight: 'bold' }]}>김지연</Text>
                    <Text style={styles.infoText}>https://blog.naver.com/wusemr2</Text>
                </View>
            </View>

            <View style={styles.postTypeContainer}>
                <TouchableOpacity>
                    <Ionicon name="grid" size={30} color='#555555' />
                </TouchableOpacity>

                {/** 추후 태그, 릴스 등의 타입이 추가될 수도 있음 */}
            </View>

            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={styles.postsContainer}
            />
        </>
    )
}

export default ProfileFormat

const styles = StyleSheet.create({
    profileContainer: {
        justifyContent: 'center'
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    infoTextContainer: {
        backgroundColor: '#00000010',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40
    },
    infoText: {
        fontSize: 16,
        color: '#333333'
    },
    profileImage: {
        borderRadius: 100,
        height: 100,
        width: 100
    },
    postTypeContainer: {
        backgroundColor: '#00000010',
        height: 40,
        alignItems: 'center'
    },
    postsContainer: {
        marginVertical: 5
    },
    postItem: {
        width: itemSize,
        height: itemSize,
        marginRight: 2.5,
        marginBottom: 2.5
    },
    postImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    }
})