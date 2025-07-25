import { component$, useVisibleTask$, useSignal } from '@builder.io/qwik';
import { useLanguage } from '@/context/LanguageContext';
import { translate } from '@/utils/translate';
import { pageLoaderTranslations } from './translations';
import './style.scss';

export const PageLoader = component$(() => {
  const showLoader = useSignal(true);
  const context = useLanguage();
  
  // 번역된 텍스트를 미리 계산
  const loadingText = translate(pageLoaderTranslations, 'loading', context.selectedLanguage.value);

  useVisibleTask$(() => {
    const hasLoaded = sessionStorage.getItem('page-loaded');
    
    if (hasLoaded) {
      showLoader.value = false;
      return;
    }

    const pageLoader = document.querySelector('.page-loder');
    if (!pageLoader) return;

    setTimeout(() => {
      pageLoader.classList.add('hide');
      
      const handleAnimationEnd = () => {
        pageLoader.classList.add('full-hide');
        sessionStorage.setItem('page-loaded', 'true');
        pageLoader.removeEventListener('animationend', handleAnimationEnd);
      };
      
      pageLoader.addEventListener('animationend', handleAnimationEnd);
    }, 3000);
  });

  if (!showLoader.value) return null;

  return (
    <div class="page-loder show">
      <div class="loader-content">
        <h2>
          <img src='/logo_header.png' />
        </h2>
        <div class="loader-text">{loadingText}</div>
        <div class="loader-progress"></div>
      </div>
    </div>
  );
});