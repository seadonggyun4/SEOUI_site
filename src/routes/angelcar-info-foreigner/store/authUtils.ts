// authUtils.ts
import { parseUserData } from './index';

export interface UserData {
  userName: string;
  userEmail: string;
  loginTime: string;
  userId: string;
}

/**
 * 사용자 인증 상태 확인
 * @returns 사용자 데이터 또는 null
 */
export const checkAuthStatus = (): UserData | null => {
  try {
    const foreignerAppData = sessionStorage.getItem('foreignerApp');
    if (!foreignerAppData) return null;

    const userData = parseUserData(foreignerAppData);
    if (!userData?.userName?.trim()) return null;

    return userData;
  } catch (error) {
    console.error('Failed to check auth status:', error);
    return null;
  }
};

/**
 * 사용자 로그인 처리
 * @param userData 사용자 데이터
 */
export const loginUser = (userData: Omit<UserData, 'loginTime' | 'userId'>): void => {
  try {
    const completeUserData: UserData = {
      ...userData,
      loginTime: new Date().toISOString(),
      userId: Math.random().toString(36).substr(2, 9)
    };

    sessionStorage.setItem('foreignerApp', JSON.stringify(completeUserData));

    // 로그인 시 읽지 않은 메시지가 있다고 설정
    localStorage.setItem('unreadMessages', 'true');
  } catch (error) {
    console.error('Failed to login user:', error);
    throw error;
  }
};

/**
 * 사용자 로그아웃 처리
 */
export const logoutUser = (): void => {
  try {
    sessionStorage.removeItem('foreignerApp');
    localStorage.removeItem('unreadMessages');
  } catch (error) {
    console.error('Failed to logout user:', error);
  }
};

/**
 * 이메일 유효성 검사
 * @param email 이메일 주소
 * @returns 유효성 여부
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 인증이 필요한 페이지 접근 시 리다이렉트
 * @param redirectPath 리다이렉트할 경로
 */
export const requireAuth = (redirectPath: string = '/angelcar-info-foreigner/user/'): void => {
  const userData = checkAuthStatus();
  if (!userData) {
    window.location.href = redirectPath;
  }
};