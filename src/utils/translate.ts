import { useComputed$, type Signal } from '@builder.io/qwik';

type TranslationData = Record<string, Record<string, string>>;
type Docs = Record<string, any>;

export interface DocItem {
  title: string;
  description: string;
  code: string;
  lang: string;
}

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
 * 성능 최적화된 문서 번역 훅
 * - 깊은 복사 대신 객체 참조만 변경하여 성능 향상
 * - 반응성 트리거를 위한 __lang 필드 추가
 * - 원본 데이터는 그대로 유지하여 메모리 효율성 확보
 */
export const useTranslateDocs = (
  docs: Docs,
  selectedLanguage: Signal<string>
) => {
  return useComputed$(() => {
    const currentLang = selectedLanguage.value;
    const fallback = docs['ko'] || {};
    const selected = docs[currentLang] || fallback;
    
    // 반응성 트리거용 언어 코드와 함께 원본 데이터 참조 반환
    // 깊은 복사 없이 새로운 참조 생성으로 성능 최적화
    return {
      __lang: currentLang, // 반응성 트리거용 필드
      ...selected
    };
  });
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



