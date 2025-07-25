export type TranslationData = Record<string, Record<string, string>>;

/**
 * 번역 함수
 * @param translationData - 컴포넌트별 번역 데이터 객체
 * @param key - 번역할 키
 * @param langCode - 언어 코드 (기본값: 'ko')
 * @returns 번역된 문자열
 */
export const translate = (
  translationData: TranslationData,
  key: string,
  langCode: string = 'ko'
): string => {
  return translationData[langCode]?.[key] || translationData['ko']?.[key] || key;
};

/**
 * 여러 키를 한 번에 번역하는 헬퍼 함수
 * @param translationData - 번역 데이터 객체
 * @param keys - 번역할 키들의 배열
 * @param langCode - 언어 코드
 * @returns 키-값 쌍의 객체
 */
export const translateMultiple = (
  translationData: TranslationData,
  keys: string[],
  langCode: string = 'ko'
): Record<string, string> => {
  const result: Record<string, string> = {};
  keys.forEach(key => {
    result[key] = translate(translationData, key, langCode);
  });
  return result;
};

/**
 * 별칭을 사용한 번역 객체 생성
 * @param translationData - 번역 데이터 객체
 * @param keyMap - 별칭과 실제 키의 매핑
 * @param langCode - 언어 코드
 * @returns 별칭을 키로 하는 번역 객체
 */
export const createTranslations = (
  translationData: TranslationData,
  keyMap: Record<string, string>,
  langCode: string = 'ko'
): Record<string, string> => {
  const result: Record<string, string> = {};
  Object.entries(keyMap).forEach(([alias, key]) => {
    result[alias] = translate(translationData, key, langCode);
  });
  return result;
};