import { component$, useVisibleTask$ } from '@builder.io/qwik';
import './style.scss';

export const PageLoader = component$(() => {
  useVisibleTask$(() => {
    const pageLoader = document.querySelector('.page-loder');

    if (!pageLoader) return;

    // hide 클래스 먼저 추가 (애니메이션 시작)
    setTimeout(() => {
      pageLoader.classList.add('hide');

      // 애니메이션 종료 후 full-hide 클래스 추가
      const handleAnimationEnd = () => {
        pageLoader.classList.add('full-hide');
        pageLoader.removeEventListener('animationend', handleAnimationEnd);
      };

      pageLoader.addEventListener('animationend', handleAnimationEnd);
    }, 2000);
  });

  return (
    <div class="page-loder show">
      <div class="loader-content">
        <div class="loader-spinner"></div>
        <div class="loader-text">페이지를 불러오는 중...</div>
        <div class="loader-progress"></div>
      </div>
    </div>
  );
});
