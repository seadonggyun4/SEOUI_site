import { component$, Slot } from '@builder.io/qwik';
import { Navigation } from '@/widget/navigation';
import { NavToggleButton } from '@/widget/nav-toggle-button';
import { useNavigationProvider } from '@/context/NavigationContext';
import { PageLoader } from '@/widget/page-loader';
import './layout.scss';

export default component$(() => {
  useNavigationProvider();

  return (
    <>
      <main id='main'>
        <Slot />
      </main>

      <Navigation />
      <NavToggleButton />
      <PageLoader />
    </>
  );
});
