import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../auth/UserContext"

const Login = () => {
    const navigate = useNavigate()

    const { login } = useContext(UserContext)

    const [id, setId] = useState('')
    const [password, setPassword] = useState('')

    // 로그인 수행 함수
    const handleLogin = async (e) => {
        e.preventDefault()

        const adminData = {
            id: "qwer",
            password: "qwer"
        }

        if (id === adminData.id && password === adminData.password) {
            login({ id })
            navigate("/")
            clearAll()
        } else {
            alert("아이디 또는 비밀번호가 잘못되었습니다.")
            clearAll()
        }
    }

    const goToSignupPage = () => {
        navigate('/signup')
    }

    // 전체 input 필드 지우기
    const clearAll = () => {
        setId('')
        setPassword('')
    }

    return (
        <div className="login-container">
            <h3>로그인</h3>
            <form onSubmit={handleLogin}>
                <div>
                    <label>아이디</label>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">로그인</button>
            </form>
            <div>
                <p>아직 회원이 아니신가요?</p>
                <button onClick={goToSignupPage}>회원가입</button>
            </div>
        </div>
    )
}

export default Login