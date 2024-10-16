import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

const Signup = () => {
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

    // 아이디 유효성 검사 함수
    const validateId = (input) => {
        const regex = /^[a-zA-Z0-9._]+$/
        return regex.test(input)
    }

    // 아이디 중복 확인 함수
    const handleCheckId = () => {
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
            // 중복 확인 로직을 추가로 구현해야 함
        }

        setAvailableId(true)
        setAvailableIdText('사용 가능한 아이디입니다.')
        setAvailableIdColor('#00AA00')
    }


    return (
        <div className="signup-container">
            <h3>회원가입</h3>
            <form>
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
                    {!isPasswordMatched && confirmPassword !== "" && (
                        <p style={{ color: "#FF0000" }}>비밀번호가 일치하지 않습니다.</p>
                    )}
                </div>
                <button type='submit'>회원가입</button>
            </form>
        </div>
    )
}

export default Signup