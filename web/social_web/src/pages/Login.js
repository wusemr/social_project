import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../auth/UserContext"

const Login = () => {
    const server = process.env.REACT_APP_SERVER_URL

    const navigate = useNavigate()

    const { login } = useContext(UserContext)

    const [id, setId] = useState('')
    const [password, setPassword] = useState('')
    const [loginCheckLabel, setLoginCheckLabel] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    // 로그인 수행 함수
    const handleLogin = async (e) => {
        e.preventDefault()

        // 공란 여부 검사
        if (!id || !password) {
            setLoginCheckLabel('로그인 정보를 모두 입력해주세요.')
        }

        try {
            const response = await fetch(`${server}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userid: id, password })
            })

            if (response.status === 404) {
                setLoginCheckLabel('존재하지 않는 아이디입니다.')
            } else if (response.status === 401) {
                setLoginCheckLabel('비밀번호가 일치하지 않습니다.')
            } else if (response.status === 200) {
                navigate("/")
                const { userid } = await response.json()
                alert(`${userid}님, 반갑습니다.`)
                await login({userid})
                clearAll()
            }
        } catch (e) {
            console.error('[로그인] 서버 요청 중 오류가 발생했습니다', e)
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