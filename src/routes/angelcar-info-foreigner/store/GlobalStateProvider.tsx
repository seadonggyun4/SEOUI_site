// GlobalStateProvider.tsx
import { component$, useSignal, useContextProvider, useVisibleTask$, Slot } from '@builder.io/qwik';
import {
  GlobalStateContext,
  DEFAULT_LANGUAGE,
  getStoredLanguage,
  setStoredLanguage,
  parseUserData,
  isValidLanguage
} from './index';

export default component$(() => {
  const activeLang = useSignal(DEFAULT_LANGUAGE);
  const isUserAuthenticated = useSignal(false);
  const hasUnreadMessages = useSignal(false);
  const userName = useSignal('');

  // 초기 상태 설정
  useVisibleTask$(() => {
    // 언어 설정 복원
    const storedLang = getStoredLanguage();
    activeLang.value = storedLang;

    // 사용자 인증 상태 확인
    try {
      const foreignerAppData = sessionStorage.getItem('foreignerApp');
      if (foreignerAppData) {
        const userData = parseUserData(foreignerAppData);
        if (userData?.userName?.trim()) {
          isUserAuthenticated.value = true;
          userName.value = userData.userName;

          // 로그인된 사용자에게는 기본적으로 읽지 않은 메시지가 있다고 설정
          hasUnreadMessages.value = true;
          localStorage.setItem('unreadMessages', 'true');
        }
      } else {
        // 로그인하지 않은 경우 메시지 상태 초기화
        hasUnreadMessages.value = false;
        localStorage.removeItem('unreadMessages');
      }
    } catch (error) {
      console.error('Failed to check authentication:', error);
    }
  });

  // 언어 변경 시 저장
  useVisibleTask$(({ track }) => {
    track(() => activeLang.value);

    if (isValidLanguage(activeLang.value)) {
      setStoredLanguage(activeLang.value);
    }
  });

  // 인증된 사용자의 메시지 상태 주기적 확인
  useVisibleTask$(({ track }) => {
    track(() => isUserAuthenticated.value);

    if (isUserAuthenticated.value) {
      const checkMessages = () => {
        try {
          const unreadMessages = localStorage.getItem('unreadMessages');
          hasUnreadMessages.value = unreadMessages === 'true';
        } catch (error) {
          console.error('Failed to check messages:', error);
        }
      };

      // 30초마다 메시지 상태 확인
      const interval = setInterval(checkMessages, 30000);

      return () => clearInterval(interval);
    }
  });

  const globalState = {
    activeLang,
    isUserAuthenticated,
    hasUnreadMessages,
    userName,
  };

  useContextProvider(GlobalStateContext, globalState);

  return <Slot />;
});