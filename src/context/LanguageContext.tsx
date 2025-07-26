import {
  component$,
  createContextId,
  useContextProvider,
  useContext,
  useSignal,
  Slot,
  $,
  Signal,
  QRL,
  useVisibleTask$
} from '@builder.io/qwik';

// 언어 타입 정의
export interface Language {
  code: string;
  label: string;
  flag: string;
}

// 언어 컨텍스트 인터페이스
export interface LanguageContext {
  selectedLanguage: Signal<string>;
  isDropdownOpen: Signal<boolean>;
  languages: Language[];
  selectLanguage: QRL<(langCode: string) => void>;
  toggleDropdown: QRL<() => void>;
  closeDropdown: QRL<() => void>;
}

// 지원하는 언어 목록
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' }
];

// sessionStorage 키 상수
const LANGUAGE_STORAGE_KEY = 'seo-select-docs-language';

// 언어 컨텍스트 ID 생성
export const LanguageContextId = createContextId<LanguageContext>('language-context');

// sessionStorage에서 언어 불러오기 (SSR 안전)
const getStoredLanguage = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    return sessionStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    console.warn('sessionStorage 접근 실패:', error);
    return null;
  }
};

// sessionStorage에 언어 저장하기 (SSR 안전)
const storeLanguage = (langCode: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
  } catch (error) {
    console.warn('sessionStorage 저장 실패:', error);
  }
};

// 유효한 언어 코드인지 검증
const isValidLanguageCode = (code: string): boolean => {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
};

// 언어 컨텍스트 Provider 컴포넌트
export const LanguageProvider = component$<{ 
  defaultLanguage?: string 
}>(({ defaultLanguage = 'ko' }) => {
  // 초기 언어 설정 - 저장된 값이 있으면 사용, 없으면 기본값
  const selectedLanguage = useSignal(defaultLanguage);
  const isDropdownOpen = useSignal(false);

  // 클라이언트 사이드에서 sessionStorage 확인 및 복원
  useVisibleTask$(() => {
    const storedLang = getStoredLanguage();
    
    if (storedLang && isValidLanguageCode(storedLang)) {
      // 저장된 언어가 유효하고 현재 선택된 언어와 다르면 변경
      if (selectedLanguage.value !== storedLang) {
        selectedLanguage.value = storedLang;
        console.log(`언어 복원됨: ${storedLang}`);
      }
    } else {
      // 저장된 언어가 없거나 유효하지 않으면 현재 언어를 저장
      storeLanguage(selectedLanguage.value);
    }
  });

  // 액션 정의
  const selectLanguage = $((langCode: string) => {
    // 언어 코드 검증
    if (!isValidLanguageCode(langCode)) {
      console.warn(`유효하지 않은 언어 코드: ${langCode}`);
      return;
    }

    // 이미 선택된 언어와 같으면 무시
    if (selectedLanguage.value === langCode) {
      isDropdownOpen.value = false;
      return;
    }

    // 언어 변경
    selectedLanguage.value = langCode;
    isDropdownOpen.value = false;
    
    // sessionStorage에 저장
    storeLanguage(langCode);
    
    console.log(`언어 변경됨: ${langCode}`);
    
    // 필요하다면 추가 로직 실행 (예: 분석 이벤트 전송)
    // analytics.track('language_changed', { language: langCode });
  });

  const toggleDropdown = $(() => {
    isDropdownOpen.value = !isDropdownOpen.value;
  });

  const closeDropdown = $(() => {
    isDropdownOpen.value = false;
  });

  // 컨텍스트 값
  const contextValue: LanguageContext = {
    selectedLanguage,
    isDropdownOpen,
    languages: SUPPORTED_LANGUAGES,
    selectLanguage,
    toggleDropdown,
    closeDropdown
  };

  // 컨텍스트 제공
  useContextProvider(LanguageContextId, contextValue);

  return <Slot />;
});

// 언어 컨텍스트 사용 훅
export const useLanguage = () => {
  const context = useContext(LanguageContextId);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// 현재 선택된 언어 정보만 가져오는 훅
export const useCurrentLanguage = () => {
  const context = useLanguage();
  return context.languages.find(lang => lang.code === context.selectedLanguage.value) || context.languages[0];
};

// 언어 코드로 언어 정보 가져오는 유틸리티 함수
export const getLanguageByCode = (code: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

// 언어 초기화 함수
export const resetLanguageStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    console.warn('언어 설정 초기화 실패:', error);
  }
};