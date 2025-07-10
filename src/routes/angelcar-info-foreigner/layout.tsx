// Layout.tsx
// angelcar-info-foreigner/layout.tsx
import { component$, Slot, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import Footer from './components/Footer';
import CircleMenu from './components/CircleMenu';
import GlobalStateProvider from './store/GlobalStateProvider';

export default component$(() => {
  const isUserPage = useSignal(false);

  useVisibleTask$(() => {
    if (typeof window !== 'undefined') {
      isUserPage.value = window.location.pathname.includes('/user');
    }
  });

  return (
    <GlobalStateProvider>
      <div class="app-layout">
        <Slot />

        {!isUserPage.value && (
          <>
            <Footer />
            <CircleMenu />
          </>
        )}
      </div>
    </GlobalStateProvider>
  );
});