import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { AgRadio } from '@/components/ag-radio';

export const AgRadioHost = component$<{
  id: string;
  name: string;
  options: { label: string; value: string }[];
  value?: string;
  disabled?: boolean;
}>(({ id, name, options, value, disabled = false }) => {
  useVisibleTask$(() => {
    if (!customElements.get('ag-radio')) {
      customElements.define('ag-radio', AgRadio);
    }

    const el = document.getElementById(id) as HTMLElement & {
      name: string;
      value?: string;
      disabled?: boolean;
      options?: { label: string; value: string }[];
    };

    if (el) {
      el.name = name;
      el.options = options;
      if (value) el.value = value;
      if (disabled) el.setAttribute('disabled', '');
    }
  });

  return <div dangerouslySetInnerHTML={`<ag-radio id="${id}"></ag-radio>`} />;
});
