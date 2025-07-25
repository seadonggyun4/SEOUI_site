import { component$, Slot } from '@builder.io/qwik';
import { Navigation } from '@/widget/navigation';
import { NavToggleButton } from '@/widget/nav-toggle-button';
import { useNavigationProvider } from '@/context/NavigationContext';
import { PageLoader } from '@/widget/page-loader';
import { MobileNavigation } from '@/widget/mobile-navigation';
import './layout.scss';
import './layout-component-page.scss'

export default component$(() => {
  useNavigationProvider();

  return (
    <>
      <main id='main'>
        <Slot />
      </main>

      <MobileNavigation />
      <Navigation />
      <NavToggleButton />
      <PageLoader />
    </>
  );
});
