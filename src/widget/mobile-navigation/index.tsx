import { component$, $ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { useNavigation } from '@/context/NavigationContext';
import './style.scss';

export const MobileNavigation = component$(() => {
  const nav = useNavigation();
  const loc = useLocation();
  const path = loc.url.pathname;

  const tab = path.startsWith('/components-page') ? 'component' : '';
  const currentLinks = tab === 'component' ? componentLinks : [];

  // 네비게이션 닫기 함수 (토글 방식)
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

// 네비게이션 데이터 (기존과 동일)
const componentLinks = [
  {
    title: 'Search Selete',
    children: [
      { label: '셀렉트 박스', href: '/components-page/ag-select/' },
      { label: '검색 셀렉트 박스', href: '/components-page/ag-select-search/' },
    ],
  },
  {
    title: 'DatePicker',
    children: [
      { label: '달력', href: '/components-page/ag-datepicker/' },
    ],
  },
  {
    title: 'Toast Message',
    children: [
      { label: '알림 메시지', href: '/components-page/ag-toast/' },
    ],
  },
  {
    title: 'Grid Table',
    children: [
      { label: '그리드 테이블', href: '/components-page/ag-grid-table/' },
    ],
  },
  {
    title: 'CheckBox Type',
    children: [
      { label: '체크박스', href: '/components-page/ag-check-box/' },
    ],
  },
];