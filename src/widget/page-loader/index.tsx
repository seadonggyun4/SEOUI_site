import { component$, useVisibleTask$, useSignal } from '@builder.io/qwik';
import './style.scss';

export const PageLoader = component$(() => {
  const showLoader = useSignal(true);

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
          <img src='/logo.png' />
        </h2>
        <div class="loader-text">페이지를 불러오는 중...</div>
        <div class="loader-progress"></div>
      </div>
    </div>
  );
});
