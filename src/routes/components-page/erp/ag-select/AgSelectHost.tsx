import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { AgSelect } from '@/components/ag-select';

export const AgSelectHost = component$<{
  id?: string;
  name: string;
  width?: string;
  height?: string;
  optionItems?: { value: string; label: string }[];
}>(({ id = 'ag-select-main', name, width = '240px', height = '100%', optionItems = [] }) => {
  useVisibleTask$(() => {
    if (!customElements.get('ag-select')) {
      customElements.define('ag-select', AgSelect);
    }

    const el = document.getElementById(id) as HTMLElement & {
      optionItems?: { value: string; label: string }[];
    };

    if (el) {
      el.setAttribute('name', name);
      el.setAttribute('style', `width: ${width}; height: ${height};`);
      el.optionItems = optionItems;
    }
  });

  return (
    <div
      dangerouslySetInnerHTML={`<ag-select id="${id}"></ag-select>`}
    />
  );
});
