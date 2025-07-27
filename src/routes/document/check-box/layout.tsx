import { component$, Slot, useVisibleTask$ } from '@builder.io/qwik';

export default component$(() => {
  useVisibleTask$(() => {
    import('@/components/seo-check-box');
    import('@/components/seo-toggle');
    import('@/components/seo-radio');
  });

  return ( <Slot /> );
});