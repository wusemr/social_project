import React, { useContext } from "react"
import { Routes, Route, Navigate, Link } from "react-router-dom"
import { UserContext } from "../auth/UserContext"

// import pages
import Main from "../pages/Main"
import Login from "../pages/Login"
import Signup from "../pages/Signup"

const Navigation = () => {
    const { user } = useContext(UserContext)

    return (
        <div style={{ display: "flex" }}>
            <nav className="sidebar" style={{ display: "grid" }}>
                <Link to="/">홈</Link>
                <Link to="/profile">프로필</Link>
                <Link to="/settings">설정</Link>
            </nav>
            <div className="main-content">
                <Routes>
                    {/** 로그인 여부에 따른 라우팅 처리 */}
                    {
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
            </div>
        </div>
    )
}

export default Navigation