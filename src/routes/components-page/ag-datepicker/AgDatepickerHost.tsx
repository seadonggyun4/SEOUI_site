import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { AgDatePicker } from '@/components/ag-datepicker';

export const AgDatepickerHost = component$(() => {
  useVisibleTask$(() => {
    if (!customElements.get('ag-datepicker')) {
      customElements.define('ag-datepicker', AgDatePicker);
    }
  });

  return (
    // SSR에서 안전하게 처리되도록 HTML 문자열로 렌더링
    <div dangerouslySetInnerHTML="<ag-datepicker id='ag-datepicker-main'></ag-datepicker>" />
  );
});
