import { useComputed$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { 
  selectMenu, 
  ToastMenu, 
  CheckBoxMenu, 
  GridTableMenu, 
  DatePickerMenu 
} from '@/config/menu';

// 메뉴 타입 정의
export interface MenuGroup {
  title: string;
  children: Array<{
    label: string;
    href: string;
  }>;
}

// 메뉴 키워드 매핑
const MENU_KEYWORDS = {
  'select': selectMenu,
  'toast': ToastMenu,
  'check-box': CheckBoxMenu,
  'checkbox': CheckBoxMenu, // 하이픈 없는 경우도 대응
  'grid-table': GridTableMenu,
  'gridtable': GridTableMenu, // 하이픈 없는 경우도 대응
  'date-picker': DatePickerMenu,
  'datepicker': DatePickerMenu // 하이픈 없는 경우도 대응
} as const;

// 기본 에러 메뉴
const DEFAULT_ERROR_MENU: MenuGroup[] = [
  {
    title: 'Error',
    children: [
      { label: 'label에 오류가 발생했습니다.', href: '#' }
    ]
  }
];

/**
 * 경로 기반 메뉴 매칭 훅
 * 전체 경로 세그먼트에서 일치하는 메뉴 키워드를 찾아 해당 메뉴를 반환
 */
export const useMenuMatcher = () => {
  const loc = useLocation();

  // 현재 경로 추출
  const currentPathname = useComputed$(() => {
    if (!loc || !loc.url) return '';
    return loc.url.pathname || '';
  });

  // 경로 세그먼트에서 메뉴 키워드 찾기
  const findMenuKeyword = useComputed$(() => {
    const pathname = currentPathname.value;
    if (!pathname) return null;

    // 경로를 세그먼트로 분할 ('/'로 분할하고 빈 문자열 제거)
    const segments = pathname.split('/').filter(segment => segment !== '');
    
    // 모든 세그먼트를 순회하면서 메뉴 키워드와 일치하는지 확인
    for (const segment of segments) {
      // 정규화: 소문자로 변환하고 특수문자 제거
      const normalizedSegment: string = segment.toLowerCase().replace(/[^a-z-]/g, '');
      
      // 메뉴 키워드 목록에서 일치하는 항목 찾기
      if (normalizedSegment in MENU_KEYWORDS) {
        return normalizedSegment as keyof typeof MENU_KEYWORDS;
      }
      
      // 하이픈 제거한 버전도 체크 (예: 'check-box' -> 'checkbox')
      const dehyphenatedSegment: string = normalizedSegment.replace(/-/g, '');
      if (dehyphenatedSegment in MENU_KEYWORDS) {
        return dehyphenatedSegment as keyof typeof MENU_KEYWORDS;
      }
    }

    return null;
  });

  // 현재 메뉴 반환
  const currentMenu = useComputed$(() => {
    const keyword = findMenuKeyword.value;
    
    if (keyword && keyword in MENU_KEYWORDS) {
      return MENU_KEYWORDS[keyword];
    }
    
    return DEFAULT_ERROR_MENU;
  });

  // 현재 활성 메뉴 키워드 반환 (디버깅용)
  const activeMenuKeyword = useComputed$(() => findMenuKeyword.value);

  // TopBar에서 사용할 active 상태 확인을 위한 유틸리티 함수
  const checkMenuActive = (menuLink: string): boolean => {
    const currentKeyword = findMenuKeyword.value;
    if (!currentKeyword) return false;

    // 메뉴 링크에서도 동일한 로직으로 키워드 추출
    const linkSegments = menuLink.split('/').filter(segment => segment !== '');
    
    for (const segment of linkSegments) {
      const normalizedSegment: string = segment.toLowerCase().replace(/[^a-z-]/g, '');
      
      if (normalizedSegment === currentKeyword) return true;
      
      const dehyphenatedSegment: string = normalizedSegment.replace(/-/g, '');
      if (dehyphenatedSegment === currentKeyword) return true;
    }
    
    return false;
  };

  return {
    currentMenu,
    currentPathname,
    activeMenuKeyword,
    checkMenuActive
  };
};