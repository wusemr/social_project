import { createContext, useContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const login = async (userInfo) => {
        setUser(userInfo)
        await AsyncStorage.setItem('user', JSON.stringify(userInfo))
        console.log(`사용자 ${userInfo} 님의 정보가 저장되었습니다.`)
    }

    const logout = async () => {
        setUser(null)
        await AsyncStorage.removeItem('user')
        console.log('사용자 정보가 삭제되었습니다.')
    }

    const loadUser = async () => {
        const userInfo = await AsyncStorage.getItem('user')
        if (userInfo) {
            setUser(JSON.parse(userInfo))
        }
        console.log('사용자 정보가 로드되었습니다.')
    }

    useEffect(() => {
        loadUser()
    }, [])

    return (
        <UserContext.Provider value={{ user, login, logout, loadUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)