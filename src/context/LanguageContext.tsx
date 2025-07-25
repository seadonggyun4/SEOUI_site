import { 
  component$, 
  createContextId, 
  useContextProvider, 
  useContext, 
  useSignal, 
  Slot,
  $,
  Signal,
  QRL 
} from '@builder.io/qwik';

// 언어 타입 정의
export interface Language {
  code: string;
  label: string;
  flag: string;
}

// 언어 컨텍스트 상태 인터페이스
export interface LanguageContextState {
  selectedLanguage: string;
  isDropdownOpen: boolean;
  languages: Language[];
}

// 언어 컨텍스트 액션 인터페이스
export interface LanguageContextActions {
  selectLanguage: QRL<(langCode: string) => void>;
  toggleDropdown: QRL<() => void>;
  closeDropdown: QRL<() => void>;
}

// 전체 언어 컨텍스트 인터페이스
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

// 언어 컨텍스트 ID 생성
export const LanguageContextId = createContextId<LanguageContext>('language-context');

// 언어 컨텍스트 Provider 컴포넌트
export const LanguageProvider = component$<{ defaultLanguage?: string }>(({ defaultLanguage = 'ko' }) => {
  // 상태 관리
  const selectedLanguage = useSignal(defaultLanguage);
  const isDropdownOpen = useSignal(false);

  // 액션 정의
  const selectLanguage = $((langCode: string) => {
    selectedLanguage.value = langCode;
    isDropdownOpen.value = false;
    
    // 여기서 필요하다면 언어 변경에 따른 추가 로직 실행
    // 예: localStorage 저장, API 호출 등
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', langCode);
    }
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