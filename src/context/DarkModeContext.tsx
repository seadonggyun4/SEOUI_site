import { 
  createContextId, 
  useContext, 
  useContextProvider, 
  useSignal, 
  useVisibleTask$,
  component$,
  Slot,
  $,
  type Signal,
  type QRL
} from '@builder.io/qwik';

// 다크모드 컨텍스트 타입 정의 - QRL 타입 사용
export interface DarkModeContextValue {
  isDark: Signal<boolean>;
  toggleDarkMode: QRL<() => void>;
  setDarkMode: QRL<(isDark: boolean) => void>;
}

// 컨텍스트 ID 생성
export const DarkModeContext = createContextId<DarkModeContextValue>('dark-mode-context');

// 다크모드 컨텍스트 훅
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

// 다크모드 컨텍스트 프로바이더 훅
export const useDarkModeProvider = () => {
  const isDark = useSignal<boolean>(false);

  // 다크모드 토글 함수 - $ 래퍼로 감싸기
  const toggleDarkMode = $(() => {
    const newValue = !isDark.value;
    isDark.value = newValue;
    
    // DOM 업데이트
    if (typeof document !== 'undefined') {
      if (newValue) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      
      // localStorage에 저장
      localStorage.setItem('darkMode', newValue.toString());
    }
  });

  // 다크모드 설정 함수 - $ 래퍼로 감싸기
  const setDarkMode = $((value: boolean) => {
    isDark.value = value;
    
    // DOM 업데이트
    if (typeof document !== 'undefined') {
      if (value) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      
      // localStorage에 저장
      localStorage.setItem('darkMode', value.toString());
    }
  });

  // 초기값 로드 (브라우저 환경에서만)
  useVisibleTask$(() => {
    if (typeof window !== 'undefined') {
      // localStorage에서 저장된 값 확인
      const savedDarkMode = localStorage.getItem('darkMode');
      
      if (savedDarkMode !== null) {
        // 저장된 값이 있으면 사용
        const savedValue = savedDarkMode === 'true';
        isDark.value = savedValue;
        if (savedValue) {
          document.body.classList.add('dark');
        }
      } else {
        // 저장된 값이 없으면 시스템 설정 확인
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDark.value = prefersDark;
        if (prefersDark) {
          document.body.classList.add('dark');
        }
        // 시스템 설정을 localStorage에 저장
        localStorage.setItem('darkMode', prefersDark.toString());
      }

      // 시스템 테마 변경 감지
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        // localStorage에 저장된 값이 없을 때만 시스템 설정 따라감
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === null) {
          // setDarkMode 함수를 직접 호출하지 않고 상태만 업데이트
          isDark.value = e.matches;
          if (e.matches) {
            document.body.classList.add('dark');
          } else {
            document.body.classList.remove('dark');
          }
          localStorage.setItem('darkMode', e.matches.toString());
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      
      // 클린업
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  });

  const contextValue: DarkModeContextValue = {
    isDark,
    toggleDarkMode,
    setDarkMode,
  };

  useContextProvider(DarkModeContext, contextValue);

  return contextValue;
};

// 다크모드 프로바이더 컴포넌트
export const DarkModeProvider = component$(() => {
  // 다크모드 컨텍스트 프로바이더 초기화
  useDarkModeProvider();

  return <Slot />;
});