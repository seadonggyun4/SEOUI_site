import { component$, $ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { useNavigation } from '@/context/NavigationContext';
import { menu } from '@/config/menu';
import './style.scss';

export const MobileNavigation = component$(() => {
  const nav = useNavigation();
  const loc = useLocation();
  const currentLinks = menu;

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
