import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Octicons from "react-native-vector-icons/Octicons"
import Feather from "react-native-vector-icons/Feather"

import LoginScreen from "../screens/authentication/LoginScreen"
import SignUpScreen from "../screens/authentication/SignUpScreen"
import ChatListScreen from "../screens/chat/ChatListScreen"
import ChatScreen from "../screens/chat/ChatScreen"
import FollowerScreen from "../screens/follow/FollowerScreen"
import FollowingScreen from "../screens/follow/FollowingScreen"
import NotificationScreen from "../screens/notifications/NotificationScreen"
import CommentsScreen from "../screens/post/CommentsScreen"
import CreatePostScreen from "../screens/post/CreatePostScreen"
import LikeListScreen from "../screens/post/LikeListScreen"
import PostListScreen from "../screens/post/PostListScreen"
import ProfileScreen from "../screens/profile/ProfileScreen"
import SearchScreen from "../screens/profile/SearchScreen"
import SettingScreen from "../screens/settings/SettingScreen"
import CaptionScreen from "../screens/post/CaptionScreen"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const ICON_COLOR = "#DDDDDD"
const FOCUSED_ICON_COLOR = "#777777"
const ICON_SIZE = 27

const MainTab = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: [
                    {
                        display: "flex",
                        justifyContent: "center",
                        height: 90
                    },
                    null
                ]
            }}
        >
            <Tab.Screen
                name="PostList"
                component={PostListScreen}
                options={({ route }) => ({
                    tabBarIcon: ({ color, size, focused }) => (
                        <Octicons
                            name="home"
                            color={focused ? FOCUSED_ICON_COLOR : ICON_COLOR}
                            size={ICON_SIZE} />
                    ),
                    tabBarLabel: "",
                    headerShown: false
                })}
            />

            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={({ route }) => ({
                    tabBarIcon: ({ color, size, focused }) => (
                        <Octicons
                            name="search"
                            color={focused ? FOCUSED_ICON_COLOR : ICON_COLOR}
                            size={ICON_SIZE} />
                    ),
                    tabBarLabel: "",
                    headerShown: false
                })}
            />

            <Tab.Screen
                name="CreatePost"
                component={CreatePostScreen}
                options={({ route }) => ({
                    tabBarIcon: ({ color, size, focused }) => (
                        <Octicons
                            name="diff-added"
                            color={focused ? FOCUSED_ICON_COLOR : ICON_COLOR}
                            size={ICON_SIZE} />
                    ),
                    tabBarLabel: "",
                    headerShown: false
                })}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={({ route }) => ({
                    tabBarIcon: ({ color, size, focused }) => (
                        <Feather
                            name="user"
                            color={focused ? FOCUSED_ICON_COLOR : ICON_COLOR}
                            size={ICON_SIZE} />
                    ),
                    tabBarLabel: "",
                    headerShown: false
                })}
            />
        </Tab.Navigator>
    )
}

const Navigation = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MainTab" component={MainTab} options={{ headerShown: false }} />
            <Stack.Screen name="ChatList" component={ChatListScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Caption" component={CaptionScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Follower" component={FollowerScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Following" component={FollowingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Comments" component={CommentsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LikeList" component={LikeListScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Setting" component={SettingScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default Navigation