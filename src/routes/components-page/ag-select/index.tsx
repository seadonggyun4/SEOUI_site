import { component$, $, useVisibleTask$ } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { docs } from './docs';

export default component$(() => {
  useVisibleTask$(() => {
    import('@/components/ag-select').then((mod) => {
      if (!customElements.get('ag-select')) {
        customElements.define('ag-select', mod.AgSelect);
      }

      // 가상 스크롤용 대용량 데이터
      const brand = document.getElementById('brand-select') as HTMLElement & {
        optionItems?: any[];
      };

      if (brand) {
        brand.optionItems = Array.from({ length: 10000 }, (_, i) => ({
          value: `car-${i.toString().padStart(3, '0')}`,
          label: `Car-${i.toString().padStart(3, '0')}`,
        }));
      }

      // 이벤트 처리용 셀렉트
      const location = document.getElementById('location-select') as HTMLElement & {
        optionItems?: any[];
        value?: string;
      };

      if (location) {
        location.optionItems = [
          { value: 'seoul', label: '서울' },
          { value: 'busan', label: '부산' },
          { value: 'incheon', label: '인천' },
          { value: 'daegu', label: '대구' },
          { value: 'daejeon', label: '대전' },
          { value: 'ulsan', label: '울산' },
          { value: 'jeju', label: '제주' },
        ];
        location.value = 'seoul'; // 초기 선택값

        // select 이벤트 수신
        location.addEventListener('onSelect', (e: Event) => {
          const { value, label } = (e as CustomEvent).detail;
          console.log('선택 이벤트 발생:', value, label);

          const form = location.closest('form');
          if(!form) return;
          if (typeof form.requestSubmit === 'function') {
            form.requestSubmit();
          }
        });
      }
    });
  });

  const handleSubmit = $((ev: SubmitEvent) => {
    ev.preventDefault();
    const form = ev.target as HTMLFormElement;
    const select = form.querySelector('#location-select') as HTMLElement & { value?: string };
    // alert(`선택된 지역: ${select?.value ?? '없음'}`);
  });

  return (
    <>
      <DocSection {...docs.virtual}>
        <div
          dangerouslySetInnerHTML={`<ag-select width="30rem" id="brand-select" name="brand" multiple></ag-select>`}
        />
      </DocSection>

      <DocSection {...docs.keyboard} />

      <DocSection {...docs.behavior}>
        <form
          preventdefault:submit
          onSubmit$={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div
            dangerouslySetInnerHTML={`<ag-select id="location-select" name="location" width="200px"></ag-select>`}
          />
          <ag-button type="submit">선택한 지역 제출</ag-button>
        </form>
      </DocSection>
    </>
  );
});
