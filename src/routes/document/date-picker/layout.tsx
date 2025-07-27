import { component$, Slot, useVisibleTask$ } from '@builder.io/qwik';

export default component$(() => {
  useVisibleTask$(() => {
    import('@/components/seo-datepicker');
  });

  return ( <Slot /> );
});