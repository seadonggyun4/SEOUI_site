import { component$, $ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { useNavigation } from '@/context/NavigationContext';
import { 
  selectMenu, 
  ToastMenu, 
  CheckBoxMenu, 
  GridTableMenu, 
  DatePickerMenu 
} from '@/config/menu';
import './style.scss';

export const MobileNavigation = component$(() => {
  const nav = useNavigation();
  const loc = useLocation();
  
  // 현재 경로의 첫 번째 세그먼트 추출
  const pathSegments = loc.url.pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  
  // 첫 번째 세그먼트에 따라 적절한 메뉴 선택
  const getCurrentMenu = () => {
    switch (firstSegment) {
      case 'select':
        return selectMenu;
      case 'toast':
        return ToastMenu;
      case 'check-box':
        return CheckBoxMenu;
      case 'grid-table':
        return GridTableMenu;
      case 'date-picker':
        return DatePickerMenu;
      default:
        return [
          {
            title: 'Error',
            children: [
              { label: 'label에 오류가 발생했습니다.', href: '#' }
            ]
          }
        ]; // 기본 더미 메뉴
    }
  };
  
  const currentLinks = getCurrentMenu();

  const closeNav = $(() => {
    nav.isOpen = false;
  });

  return (
    <aside class={{ 'mobile-nav': true, open: nav.isOpen }}>
      {/* 오버레이 배경 */}
      <div 
        class="mobile-nav-overlay"
        onClick$={closeNav}
      />
      
      {/* 네비게이션 패널 */}
      <div class="mobile-nav-panel">
        <div class="mobile-nav-header">
          <img src='/logo_header.png' alt="Logo" class="mobile-nav-logo" />
          <button 
            type="button"
            class="mobile-nav-close"
            onClick$={closeNav}
            aria-label="네비게이션 닫기"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <nav class="mobile-nav-content">
          {currentLinks.map((group) => (
            <div class="mobile-nav-group" key={group.title}>
              <div class="mobile-nav-group-title">
                {group.title}
              </div>
              <ul class="mobile-nav-group-list">
                {group.children.map((item) => (
                  <li key={item.href} class="mobile-nav-item">
                    <Link
                      href={item.href}
                      class={`mobile-nav-link ${loc.url.pathname === item.href ? 'active' : ''}`}
                      onClick$={closeNav} // 링크 클릭 시 자동 닫기
                    >
                      <span class="mobile-nav-item-label">{item.label}</span>
                      <i class="fas fa-chevron-right mobile-nav-item-arrow"></i>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
});