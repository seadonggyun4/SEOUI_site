import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { docs } from './docs';
import { openDatePicker as _openDatePicker } from '@/utils/date-picker';
import { AgDatepickerHost } from './AgDatepickerHost';

interface DatepickerElement extends HTMLElement {
  date: string;
  time: string;
  criteriaDate: string | null;
  minDate: string | null;
  open: (rect: DOMRect, triggerEl?: HTMLElement, showTime?: boolean) => void;
  close: () => Promise<void>;
}

interface OnChangeEventDetail {
  date: string;
  time: string;
  id: string;
}

const openDatePicker = _openDatePicker as (params: {
  target: HTMLInputElement;
  datepicker: DatepickerElement;
  startTargetId?: string;
  endTargetId?: string;
}) => void;

export default component$(() => {
  useVisibleTask$(() => {
    const today = new Date().toISOString().split('T')[0];

    const config = [
      { id: 'date', value: today },
      { id: 'datetime-local', value: `${today}T10:30` },
      { id: 'datetime', value: `${today}T15:00` },
      { id: 'start-local', value: `${today}T10:30`, range: true },
      { id: 'end-local', value: `${today}T15:30`, range: true },
      { id: 'keyboard-input', value: `${today}T09:00` }, // keydown 예제용
    ];

    const datepicker = document.getElementById('ag-datepicker-main') as DatepickerElement | null;

    config.forEach(({ id, value, range }) => {
      const input = document.getElementById(id) as HTMLInputElement | null;
      if (!input || !datepicker) return;

      input.value = value;
      input.addEventListener('click', () => {
        openDatePicker({
          target: input,
          datepicker,
          ...(range && {
            startTargetId: 'start-local',
            endTargetId: 'end-local',
          }),
        });
      });
    });

    datepicker?.addEventListener('onChange', (e: Event) => {
      const { date, time, id } = (e as CustomEvent<OnChangeEventDetail>).detail;
      const target = document.getElementById(id) as HTMLInputElement | null;
      if (!target) return;

      switch (id) {
        case 'date':
          target.value = date;
          break;
        case 'datetime-local':
        case 'datetime':
        case 'end-local':
        case 'keyboard-input':
          target.value = `${date}T${time}`;
          break;
        case 'start-local':
          target.value = `${date}T${time}`;
          datepicker.close().then(() => {
            datepicker.criteriaDate = date;
            datepicker.date = date;
            datepicker.time = time;

            const endInput = document.getElementById('end-local') as HTMLInputElement | null;
            if (endInput) endInput.value = `${date}T${time}`;

            requestAnimationFrame(() => {
              openDatePicker({
                target: endInput!,
                datepicker,
                startTargetId: 'start-local',
                endTargetId: 'end-local',
              });
            });
          });
          break;
      }
    });
  });

  return (
    <>
      <DocSection {...docs.basic}>
        <input id="date" type="date" style={{ width: '200px' }} />
        <input id="datetime-local" type="datetime-local" style={{ width: '200px' }} />
        <input id="datetime" type="datetime" style={{ width: '200px' }} />
      </DocSection>

      <DocSection {...docs.range}>
        <input id="start-local" type="datetime-local" style={{ width: '200px' }} />
        ~
        <input id="end-local" type="datetime-local" style={{ width: '200px' }} />
      </DocSection>

      <DocSection {...docs.keydown}>
        <input id="keyboard-input" type="datetime-local" style={{ width: '200px' }} />
        <p>
          <small>
            이 필드를 클릭한 후 <strong>Enter</strong> 키를 눌러 선택값 적용, <strong>ESC</strong> 키로 닫기를 확인할 수 있습니다.
          </small>
        </p>
      </DocSection>

      <AgDatepickerHost />
    </>
  );
});
