import { component$, Slot, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigation } from '@/context/NavigationContext'
import { useNavigate, useLocation } from '@builder.io/qwik-city';

export default component$(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const nav = useNavigation()

  useVisibleTask$(() => {
    import('@/components/seo-check-box');
    import('@/components/seo-toggle');
    import('@/components/seo-radio');


    const $loader = document.querySelector('.document-loder') as HTMLElement;
    if (!$loader) return;

    let isNavigating = false;

    const shouldHandleNavigation = (anchor: HTMLAnchorElement | null) => {
      if (!anchor || !anchor.href || anchor.target === '_blank') return false;
      const isInternal = anchor.origin === location.url.origin;
      return isInternal && !anchor.hasAttribute('data-instant');
    };

    const showLoader = () => {
      $loader.classList.remove('hide', 'full-hide');
      $loader.classList.add('show');
    };

    const hideLoader = () => {
      $loader.classList.remove('show');
      $loader.classList.add('hide');

      const onAnimationEnd = (event: AnimationEvent) => {
        if (event.animationName !== 'curtainHide') return;

        $loader.classList.remove('hide');
        $loader.classList.add('full-hide');
        isNavigating = false;
        $loader.removeEventListener('animationend', onAnimationEnd);
      };

      $loader.addEventListener('animationend', onAnimationEnd);
    };

    const delayedNavigate = (to: string) => {
      showLoader();
      setTimeout(() => {
        navigate(to);
        hideLoader();
      }, 800);
    };

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a') as HTMLAnchorElement | null;

      if (!shouldHandleNavigation(anchor)) return;

      e.preventDefault();
      e.stopPropagation();
      if (isNavigating) return;
      isNavigating = true;

      const to = anchor!.pathname + anchor!.search + anchor!.hash;
      delayedNavigate(to);
    };

    // 전역 링크 클릭 이벤트 핸들러
    const registerNavigationInterceptor = () => {
      window.addEventListener('click', handleLinkClick, true);
      return () => window.removeEventListener('click', handleLinkClick, true);
    };

    return registerNavigationInterceptor();
  });

  return (
    <>
      <section class={`components-layout ${nav.isOpen ? '' : 'wide'}`}>
        <Slot />
      </section>

      <div class="document-loder full-hide" aria-hidden />
    </>
  );
});
