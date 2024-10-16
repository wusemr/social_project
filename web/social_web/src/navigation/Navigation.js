import React, { useContext } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { UserContext } from "../auth/UserContext"

// import pages
import Main from "../pages/Main"
import Login from "../pages/Login"
import Signup from "../pages/Signup"

const Navigation = () => {
    const { user } = useContext(UserContext)

    return (
        <Routes>
            { /** 로그인 여부에 따른 라우팅 처리 */
                user ? (
                    <>
                        <Route path="/*" element={<Main />} />
                        <Route path="/login" element={<Navigate to="/" />} />
                        <Route path="/signup" element={<Navigate to="/" />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                ) : (
                    <>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </>
                )
            }
        </Routes>
    )
}

export default Navigation