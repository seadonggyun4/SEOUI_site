import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { TopBarMenu } from '@/config/menu';
import { useLanguage, useCurrentLanguage } from '@/context/LanguageContext';
import './style.scss';

export const TopBar = component$(() => {
  const loc = useLocation();
  const context = useLanguage();
  const currentLanguage = useCurrentLanguage();

  // 현재 URL의 첫 번째 세그먼트 추출
  const getCurrentFirstSegment = () => {
    const pathname = loc.url.pathname;
    const segments = pathname.split('/').filter(segment => segment !== '');
    return segments[0] || '';
  };

  // TopBarMenu 링크의 첫 번째 세그먼트 추출
  const getLinkFirstSegment = (link: string) => {
    const segments = link.split('/').filter(segment => segment !== '');
    return segments[0] || '';
  };

  // active 상태 확인 함수
  const isActive = (menuLink: string) => {
    const currentFirstSegment = getCurrentFirstSegment();
    const linkFirstSegment = getLinkFirstSegment(menuLink);
    
    return currentFirstSegment === linkFirstSegment && currentFirstSegment !== '';
  };

  return (
    <header class="topbar">
      <div class="topbar-container">
        {/* Logo */}
        <div class="topbar-logo">
          <img src='/logo_header.png' alt="Logo" />
        </div>

        {/* Navigation Menu */}
        <nav class="topbar-nav">
          <ul class="topbar-menu">
            {TopBarMenu.map((item) => (
              <li key={item.link} class="topbar-menu-item">
                <Link
                  href={item.link}
                  class={`topbar-link ${isActive(item.link) ? 'active' : ''}`}
                >
                  <span class="topbar-link-icon">
                    <i class={item.icon}></i>
                  </span>
                  <span class="topbar-link-label">{item.label}</span>
                  <span class="topbar-link-indicator"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Language Selector */}
          <div class="topbar-language">
            <button
              class={`topbar-language-trigger ${context.isDropdownOpen.value ? 'open' : ''}`}
              onClick$={context.toggleDropdown}
            >
              <span class="topbar-language-flag">{currentLanguage.flag}</span>
              <span class="topbar-language-label">{currentLanguage.label}</span>
              <span class="topbar-language-arrow">
                <i class="fas fa-chevron-down"></i>
              </span>
            </button>

            {context.isDropdownOpen.value && (
              <div class="topbar-language-dropdown">
                {context.languages.map((lang) => (
                  <button
                    key={lang.code}
                    class={`topbar-language-option ${context.selectedLanguage.value === lang.code ? 'selected' : ''}`}
                    onClick$={() => context.selectLanguage(lang.code)}
                  >
                    <span class="topbar-language-option-flag">{lang.flag}</span>
                    <span class="topbar-language-option-label">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
});