import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { AgSelectSearch } from '@/components/ag-select-search';

export const AgSelectSearchHost = component$<{
  id?: string;
  name: string;
  width?: string;
  height?: string;
  optionItems?: { value: string; label: string }[];
}>(({ id = 'ag-select-search-main', name, width = '240px', height = '100%', optionItems = [] }) => {
  useVisibleTask$(() => {
    if (!customElements.get('ag-select-search')) {
      customElements.define('ag-select-search', AgSelectSearch);
    }

    const el = document.getElementById(id) as HTMLElement & {
      optionItems?: { value: string; label: string }[];
    };

    if (el) {
      el.setAttribute('name', name);
      el.setAttribute('style', `width: ${width}; height: ${height};`);
      el.optionItems = optionItems;

      el.addEventListener('select', () => {
        const form = el.closest('form') as HTMLFormElement | null;
        if (form) form.requestSubmit();
      });
    }
  });

  return (
    <div
      dangerouslySetInnerHTML={`<ag-select-search id="${id}"></ag-select-search>`}
    />
  );
});
