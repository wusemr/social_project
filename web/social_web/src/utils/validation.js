/**
 * 사용자 이름(username)이 한글 혹은 영어로만 이루어져 있는지 확인
 * @returns {boolean}
 */
export const validateUsername = (text) => {
    const regex = /^[가-힣a-zA-Z]+$/
    return regex.test(text)
}

/**
 * 아이디(id)가 영어, 숫자, 특수문자(._)로만 이루어져 있는지 확인
 * @returns {boolean}
 */
export const validateId = (text) => {
    const regex = /^[a-zA-Z0-9._]+$/
    return regex.test(text)
}

/**
 * 비밀번호(password)가 영어, 숫자, 특수문자(~!@#$%^&*)로만 이루어져 있는지 확인
 * @returns 
 */
export const validatePassword = (text) => {
    const regex = /^[a-zA-z0-9~!@#$%^&*]+$/
    return regex.test(text)
}