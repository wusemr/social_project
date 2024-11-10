/**
 * 현재 시간과 콘텐츠 업데이트 시간의 차이를 아래 형식으로 반환
 * @param {String} time - ISO 형식의 날짜 문자열 (예: "2024-11-02T08:39:46Z")
 * @returns {String} - 시간 차이에 따른 포맷 ('방금 전', '0분 전', '0시간 전', ... , '0년 전')
 */

export const formatTime = (time) => {
    const now = new Date()                  // 현재 시간
    const notificationTime = new Date(time) // 콘텐츠 업데이트 시간
    const diffMs = now - notificationTime   // 시간 차이 (밀리초)

    // 각 단위별 시간 차이 계산
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffWeeks = Math.floor(diffDays / 7)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    // 시간 차이에 따라 포맷
    if (diffSeconds < 60) {
        return '방금 전'
    } else if (diffMinutes < 60) {
        return `${diffMinutes}분 전`
    } else if (diffHours < 24) {
        return `${diffHours}시간 전`
    } else if (diffDays < 7) {
        return `${diffDays}일 전`
    } else if (diffDays < 30) {
        return `${diffWeeks}주 전`
    } else if (diffDays < 365) {
        return `${diffMonths}개월 전`
    } else {
        return `${diffYears}년 전`
    }
}