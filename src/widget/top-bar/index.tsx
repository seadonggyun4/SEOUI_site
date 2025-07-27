import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { TopBarMenu } from '@/config/menu';
import { useLanguage } from '@/context/LanguageContext';
import { useDarkMode } from '@/context/DarkModeContext';
import { useMenuMatcher } from '@/hooks/useMenuMatcher';
import './style.scss';

export const TopBar = component$(() => {
  const context = useLanguage();
  const { isDark, toggleDarkMode } = useDarkMode();
  const { checkMenuActive } = useMenuMatcher();
   
  // 현재 언어 정보 가져오기
  const currentLanguage = context.languages.find(
    lang => lang.code === context.selectedLanguage.value
  ) || context.languages[0];

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
                  class={`topbar-link ${checkMenuActive(item.link) ? 'active' : ''}`}
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

          {/* Action Buttons */}
          <div class="topbar-actions">
            {/* Dark Mode Toggle Button */}
            <button
              class="topbar-action-btn"
              onClick$={toggleDarkMode}
              aria-label={isDark.value ? '라이트 모드로 전환' : '다크 모드로 전환'}
              title={isDark.value ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              <i class={isDark.value ? 'fas fa-sun' : 'fas fa-moon'}></i>
            </button>

            {/* GitHub Button */}
            <a
              href="https://github.com/seadonggyun4"
              target="_blank"
              rel="noopener noreferrer"
              class="topbar-action-btn"
              aria-label="GitHub 저장소 보기"
              title="GitHub 저장소 보기"
            >
              <i class="fab fa-github"></i>
            </a>
          </div>

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