// store.ts
import { createContextId } from '@builder.io/qwik';
import { Signal } from '@builder.io/qwik';

export interface GlobalState {
  activeLang: Signal<string>;
  isUserAuthenticated: Signal<boolean>;
  hasUnreadMessages: Signal<boolean>;
  userName: Signal<string>;
}

export const GlobalStateContext = createContextId<GlobalState>('global-state');

export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = ['en', 'zh'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// 언어 유효성 검사
export const isValidLanguage = (lang: string): lang is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
};

// 세션 스토리지에서 사용자 정보 파싱
export const parseUserData = (data: string) => {
  try {
    const parsed = JSON.parse(data);
    return {
      userName: parsed.userName || '',
      userEmail: parsed.userEmail || '',
      loginTime: parsed.loginTime || '',
      userId: parsed.userId || ''
    };
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

// 로컬 스토리지에서 언어 설정 관리
export const getStoredLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  try {
    const stored = localStorage.getItem('preferredLanguage');
    return stored && isValidLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  } catch (error) {
    console.error('Failed to get stored language:', error);
    return DEFAULT_LANGUAGE;
  }
};

export const setStoredLanguage = (lang: SupportedLanguage): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('preferredLanguage', lang);
  } catch (error) {
    console.error('Failed to store language:', error);
  }
};