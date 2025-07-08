import { createContextId, useContextProvider, useContext, useStore } from '@builder.io/qwik';

interface NavigationStore {
  isOpen: boolean;
  tab: 'design' | 'component';
}

export const NavigationContext = createContextId<NavigationStore>('navigation-context');

export const useNavigationProvider = () => {
  const store = useStore<NavigationStore>({
    isOpen: true,
    tab: 'component',
  });

  useContextProvider(NavigationContext, store);

  return store;
};

export const useNavigation = () => useContext(NavigationContext);
