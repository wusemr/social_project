import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { validateId, validateUsername, validatePassword } from "../utils/validation"

const Signup = () => {
    const server = process.env.REACT_APP_SERVER_URL

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [id, setId] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [isPasswordMatched, setIsPasswordMatched] = useState(false)

    const [availableId, setAvailableId] = useState(false)
    const [availableIdText, setAvailableIdText] = useState('아이디 중복 여부를 확인해주세요.')
    const [availableIdColor, setAvailableIdColor] = useState('#AAAAAA')

    const [unPlaceholder, setUnPlaceholder] = useState('이름')
    const [idPlaceholder, setIdPlaceholder] = useState('아이디')
    const [pwPlaceholder, setPwPlaceholder] = useState('비밀번호')
    const [cpwPlaceholder, setCpwPlaceholder] = useState('비밀번호 확인')

    // 전체 input 필드 지우기
    const clearAll = () => {
        setUsername('')
        setId('')
        setPassword('')
        setConfirmPassword('')
    }

    // 회원가입 수행 함수
    const handleSignup = async (e) => {
        e.preventDefault()

        // 공란 여부 검사
        if (!username || !id || !password || !confirmPassword) {
            alert('모든 정보를 입력해 주세요.')
            return
        }

        // 아이디 유효성 검사
        if (!availableId) {
            alert('유효하지 않은 아이디입니다.')
            return
        }

        // 사용자 이름 유효성 검사
        if (!validateUsername(username)) {
            alert('유효하지 않은 사용자 이름입니다.')
            return
        }

        // 비밀번호 유효성 검사
        if (!validatePassword(password)) {
            alert('유효하지 않은 비밀번호입니다.')
            return
        }

        // 비밀번호 & 비밀번호 확인 일치 여부 검사
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.')
            return
        }

        try {
            const response = await fetch(`${server}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, userid: id, password })
            })

            if (response.status === 201) {
                alert('회원가입이 완료되었습니다.')
                navigate('/login')
                clearAll()
            } else {
                const errorData = await response.json()
                alert(`회원가입에 실패했습니다: ${errorData.message}`)
            }
        } catch (e) {
            console.error('[회원가입] 서버 요청 중 오류가 발생했습니다.', e)
        }
    }

    // 아이디 중복 확인 함수
    const handleCheckId = async () => {
        if (id === '') {
            setIdPlaceholder('아이디를 먼저 입력하세요.')
            setAvailableIdText('아이디 중복 여부를 확인해주세요.')
            setAvailableIdColor('#AAAAAA')
            return
        } else if (!validateId(id)) {
            setIdPlaceholder('영어, 숫자, 특수문자(._)만 입력이 가능합니다')
            setId('')
            return
        } else {
            try {
                const response = await fetch(`${server}/auth/check-id`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userid: id })
                })

                const result = await response.json()
                if (result.available) {
                    setAvailableId(true)
                    setAvailableIdColor('#000AC9')
                    setAvailableIdText('사용 가능한 아이디입니다.')
                } else {
                    setAvailableId(false);
                    setAvailableIdColor('#DB0000')
                    setAvailableIdText('이미 사용 중인 아이디입니다.')
                }
            } catch (error) {
                console.error('[아이디중복확인] 서버 요청 중 오류가 발생했습니다:', error)
            }
        }
    }


    return (
        <div className="signup-container">
            <h3>회원가입</h3>
            <form onSubmit={handleSignup}>
                <div>
                    <label>이름</label>
                    <input
                        type="text"
                        value={username}
                        placeholder={unPlaceholder}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>아이디</label>
                    <input
                        type="text"
                        value={id}
                        placeholder={idPlaceholder}
                        onChange={(e) => setId(e.target.value)}
                        style={{ borderColor: availableIdColor }}
                    />
                    <button type="button" onClick={handleCheckId}>
                        확인
                    </button>
                    <p style={{ color: availableIdColor }}>{availableIdText}</p>
                </div>
                <div>
                    <label>비밀번호</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        placeholder={pwPlaceholder}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>비밀번호 확인</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        placeholder={cpwPlaceholder}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setIsPasswordMatched(e.target.value === password);
                        }}
                        style={{ borderColor: isPasswordMatched ? "#00AA00" : "#FF0000" }}
                    />
                    {
                        !isPasswordMatched && confirmPassword !== "" && (
                            <p style={{ color: "#FF0000" }}>비밀번호가 일치하지 않습니다.</p>
                        )
                    }
                </div>
                <button type='submit'>회원가입</button>
            </form>
        </div>
    )
}

export default Signup