export const getChosungAll = (str) => {
  const HANGUL_START = 0xac00
  const HANGUL_END = 0xd7a3
  const CHOSUNG_LIST = [
    'ㄱ',
    'ㄲ',
    'ㄴ',
    'ㄷ',
    'ㄸ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅃ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅉ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ'
  ]
  const CHOSUNG_UNICODE = CHOSUNG_LIST.map(ch => ch.charCodeAt(0))

  let result = ''

  for (const char of str) {
    const code = char.charCodeAt(0)

    // 한글 완성형
    if (code >= HANGUL_START && code <= HANGUL_END) {
      const offset = code - HANGUL_START
      const chosungIndex = Math.floor(offset / (21 * 28))
      result += CHOSUNG_LIST[chosungIndex]
    }
    // 자모 문자 (ㄱ~ㅎ)
    else if (CHOSUNG_UNICODE.includes(code)) {
      result += char
    }
    // 숫자
    else if (/[0-9]/.test(char)) {
      result += char
    }
    // 알파벳 → 대문자로
    else if (/[a-zA-Z]/.test(char)) {
      result += char.toUpperCase()
    }
    // 그 외 특수문자 무시
  }

  return result
}