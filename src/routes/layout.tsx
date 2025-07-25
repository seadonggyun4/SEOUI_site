import { component$, Slot } from '@builder.io/qwik';

import { Navigation } from '@/widget/navigation';
import { NavToggleButton } from '@/widget/nav-toggle-button';
import { MobileNavigation } from '@/widget/mobile-navigation';
import { TopBar } from '@/widget/top-bar';

import { useNavigationProvider } from '@/context/NavigationContext';
import { LanguageProvider } from '@/context/LanguageContext';

import './layout.scss';

export default component$(() => {
  useNavigationProvider();

  return (
    <LanguageProvider defaultLanguage="en">
      <TopBar />
      <main id='main'>
        <Slot />
      </main>

      <MobileNavigation />
      <Navigation />
      <NavToggleButton />
    </LanguageProvider>
  );
});
