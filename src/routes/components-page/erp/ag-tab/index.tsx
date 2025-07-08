import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { docs } from './docs';

export default component$(() => {
  useVisibleTask$(() => {
    import('@/components/ag-tab').then((mod) => {
      if (!customElements.get('ag-tab')) {
        customElements.define('ag-tab', mod.AgTabList);
      }

      const el = document.querySelector('ag-tab');
      if (el) {
        (el as any).tabs = [
          { label: '탭 1', value: 'tab1' },
          { label: '탭 2', value: 'tab2' },
          { label: '탭 3', value: 'tab3' },
        ];
        (el as any).selected = 'tab1';

        el.addEventListener('onClick', (e) => {
          const value = (e as CustomEvent).detail.value;
          alert(`선택된 탭:, ${value}`);
        });
      }
    });
  });

  return (
    <>
      <DocSection {...docs.tab}>
        <ag-tab></ag-tab>
      </DocSection>
    </>
  );
});
