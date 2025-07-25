import { component$, useSignal, $ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import './style.scss';

export const TopBar = component$(() => {
  const loc = useLocation();
  const selectedLanguage = useSignal('ko');
  const isLanguageDropdownOpen = useSignal(false);

  const menuItems = [
    { href: '/select', label: 'Select', icon: 'fas fa-chevron-down' },
    { href: '/toast', label: 'Toast', icon: 'fas fa-bell' },
    { href: '/checkbox', label: 'CheckBox', icon: 'fas fa-check-square' },
    { href: '/grid-table', label: 'Grid Table', icon: 'fas fa-table' },
    { href: '/date-picker', label: 'Date Picker', icon: 'fas fa-calendar-alt' }
  ];

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' }
  ];

  const handleLanguageSelect = $((langCode: string) => {
    selectedLanguage.value = langCode;
    isLanguageDropdownOpen.value = false;
  });

  const toggleLanguageDropdown = $(() => {
    isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value;
  });

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage.value);

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
            {menuItems.map((item) => (
              <li key={item.href} class="topbar-menu-item">
                <Link
                  href={item.href}
                  class={`topbar-link ${loc.url.pathname === item.href ? 'active' : ''}`}
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
              class={`topbar-language-trigger ${isLanguageDropdownOpen.value ? 'open' : ''}`}
              onClick$={toggleLanguageDropdown}
            >
              <span class="topbar-language-flag">{currentLanguage?.flag}</span>
              <span class="topbar-language-label">{currentLanguage?.label}</span>
              <span class="topbar-language-arrow">
                <i class="fas fa-chevron-down"></i>
              </span>
            </button>

            {isLanguageDropdownOpen.value && (
              <div class="topbar-language-dropdown">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    class={`topbar-language-option ${selectedLanguage.value === lang.code ? 'selected' : ''}`}
                    onClick$={() => handleLanguageSelect(lang.code)}
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