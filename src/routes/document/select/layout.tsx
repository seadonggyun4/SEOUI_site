import { component$, Slot, useVisibleTask$ } from '@builder.io/qwik';

export default component$(() => {
  useVisibleTask$(() => {
    import('@/components/seo-select');
    import('@/components/seo-select-search');
  });

  return ( <Slot /> );
});