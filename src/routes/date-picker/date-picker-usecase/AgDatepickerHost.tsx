import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { AgDatePicker } from '@/components/seo-datepicker';

export const AgDatepickerHost = component$(() => {
  useVisibleTask$(() => {
    if (!customElements.get('seo-datepicker')) {
      customElements.define('seo-datepicker', AgDatePicker);
    }
  });

  return (
    // SSR에서 안전하게 처리되도록 HTML 문자열로 렌더링
    <div dangerouslySetInnerHTML="<seo-datepicker id='seo-datepicker-main'></seo-datepicker>" />
  );
});
