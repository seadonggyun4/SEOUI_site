// angelcar-info-foreigner/components/CircleMenu.tsx
import { component$, useContext, $ } from '@builder.io/qwik';
import { GlobalStateContext, setStoredLanguage, isValidLanguage } from '../store';

export default component$(() => {
  const globalState = useContext(GlobalStateContext);

  const handleFloatingBtnClick = $(() => {
    const menu = document.getElementById('circularMenu');
    menu?.classList.toggle('active');
  });

  const handleLanguageChange = $((lang: string) => {
    if (isValidLanguage(lang)) {
      globalState.activeLang.value = lang;
      setStoredLanguage(lang);

      // 메뉴 닫기
      const menu = document.getElementById('circularMenu');
      menu?.classList.remove('active');
    }
  });

  return (
    <div id="circularMenu" class="circular-menu">
      <a class="floating-btn" onClick$={handleFloatingBtnClick}>
        <i class="fa fa-language"></i>
      </a>
      <menu class="items-wrapper">
        <div
          class="menu-item"
          onClick$={() => handleLanguageChange('en')}
        >
          English
        </div>
        <div
          class="menu-item"
          onClick$={() => handleLanguageChange('zh')}
        >
          中文
        </div>
      </menu>
    </div>
  );
});