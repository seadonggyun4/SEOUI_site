import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { docs } from './docs';
import { AgSelectSearch } from '@/components/ag-select-search';

export default component$(() => {
  useVisibleTask$(() => {
    if (!customElements.get('ag-select-search')) {
      customElements.define('ag-select-search', AgSelectSearch);
    }

    const el = document.getElementById('search-select') as HTMLElement & {
      optionItems?: { value: string; label: string }[];
    };

    if (el) {
      el.optionItems = Array.from({ length: 1000 }).map((_, i) => {
        const brands = ['현대', '기아', '쉐보레', '르노', 'BMW', '벤츠', '아우디', '테슬라', '토요타', '혼다'];
        const models = [
          '아반떼', '쏘나타', '그랜저', 'K3', 'K5', 'K7', '스포티지', '싼타페', '모닝',
          '스팅어', '말리부', 'SM6', 'QM6', 'i30', 'i40', 'G70', 'G80', 'G90',
          '모델3', '모델Y', '카니발', '펠리세이드', '트랙스', '투싼', '베뉴', '니로', '셀토스', '코란도',
        ];
        const year = 2015 + (i % 10); // 2015 ~ 2024
        const brand = brands[i % brands.length];
        const model = models[i % models.length];

        return {
          value: `car-${i}`,
          label: `${brand} ${model} (${year})`,
        };
      });

      el.addEventListener('onSelect', () => {
        const form = el.closest('form') as HTMLFormElement | null;
        if (form) form.requestSubmit();
      });
    }
  });

  return (
    <DocSection {...docs.selectSearch}>
      <form
        preventdefault:submit
        onSubmit$={(ev) => {
          const form = ev.target as HTMLFormElement;
          const selectEl = form.querySelector('ag-select-search') as any;
          alert(`선택된 값: ${selectEl.value}`);
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <div dangerouslySetInnerHTML={`<ag-select-search id="search-select" name="search"></ag-select-search>`} />
        <button type="submit">제출</button>
      </form>
    </DocSection>
  );
});
