/**
 * 문자열에서 초성을 추출하는 함수
 * - 한글 완성형: 초성으로 변환
 * - 한글 자음(ㄱ~ㅎ): 그대로 유지
 * - 숫자: 그대로 유지
 * - 알파벳: 대문자로 변환
 * - 기타 문자: 무시
 */
export const getChosungAll = (str: string): string => {
  const HANGUL_START = 0xac00;
  const HANGUL_END = 0xd7a3;
  const CHOSUNG_LIST: readonly string[] = [
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
  ] as const;
  
  const CHOSUNG_UNICODE: readonly number[] = CHOSUNG_LIST.map(ch => ch.charCodeAt(0));

  let result = '';

  for (const char of str) {
    const code = char.charCodeAt(0);

    // 한글 완성형
    if (code >= HANGUL_START && code <= HANGUL_END) {
      const offset = code - HANGUL_START;
      const chosungIndex = Math.floor(offset / (21 * 28));
      result += CHOSUNG_LIST[chosungIndex];
    }
    // 자모 문자 (ㄱ~ㅎ)
    else if (CHOSUNG_UNICODE.includes(code)) {
      result += char;
    }
    // 숫자
    else if (/[0-9]/.test(char)) {
      result += char;
    }
    // 알파벳 → 대문자로
    else if (/[a-zA-Z]/.test(char)) {
      result += char.toUpperCase();
    }
    // 그 외 특수문자 무시
  }

  return result;
};