import { component$, $ } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { docs } from './docs';
import { AgRadioHost } from './AgRadioHost';

interface CustomInputElement extends HTMLElement {
  checked?: boolean;
  value?: string;
  options?: { label: string; value: string }[];
}

export default component$(() => {
  const formSubmit = $((ev: SubmitEvent) => {
    ev.preventDefault();

    const form = ev.target as HTMLFormElement;

    const $agree = form.querySelector('ag-check-box[name="agree"]') as CustomInputElement;
    const $notify = form.querySelector('ag-toggle[name="notify"]') as CustomInputElement;
    const $plan = form.querySelector('#plan-radio') as CustomInputElement;

    const result = {
      agree: $agree?.checked,
      notify: $notify?.checked,
      plan: $plan?.value,
    };

    alert(`제출 결과:\n${JSON.stringify(result, null, 2)}`);
  });

  return (
    <>
      <DocSection {...docs.checkboxState}>
        <ag-check-box name="checkbox-tracked-1"></ag-check-box>
        <ag-check-box name="checkbox-tracked-2" checked></ag-check-box>
        <ag-check-box name="checkbox-tracked-3" checked disabled></ag-check-box>
      </DocSection>

      <DocSection {...docs.checkboxLabel}>
        <ag-check-box checked label="슈퍼면책 적용"></ag-check-box>
      </DocSection>

      <DocSection {...docs.toggleState}>
        <ag-toggle name="toggle-tracked-1"></ag-toggle>
        <ag-toggle name="toggle-tracked-2" checked></ag-toggle>
        <ag-toggle name="toggle-tracked-3" checked disabled></ag-toggle>
      </DocSection>

      <DocSection {...docs.toggleLabel}>
        <ag-toggle label="취소 제외" checked></ag-toggle>
      </DocSection>

      <DocSection {...docs.radioState}>
        <AgRadioHost
          id="radio-tracked-1"
          name="radio-tracked-1"
          options={[
            { label: '옵션 A', value: '0-a' },
            { label: '옵션 B', value: '0-b' },
          ]}
          value="0-a"
        />
        <AgRadioHost
          id="radio-tracked-2"
          name="radio-tracked-2"
          options={[
            { label: '옵션 A', value: '1-a' },
            { label: '옵션 B', value: '1-b' },
          ]}
          value="1-a"
          disabled
        />
      </DocSection>

      <DocSection {...docs.submit}>
        <form preventdefault:submit onSubmit$={formSubmit} style={{
          display: 'grid',
          gap: '0.5rem'
        }}>
          <ag-check-box name="agree" label="이용 약관 동의" checked></ag-check-box>
          <ag-toggle name="notify" label="알림 수신 동의"></ag-toggle>
          <AgRadioHost
            id="plan-radio"
            name="plan"
            value="basic"
            options={[
              { label: '베이직', value: 'basic' },
              { label: '프리미엄', value: 'premium' },
            ]}
          />
          <ag-button type="submit">제출</ag-button>
        </form>
      </DocSection>
    </>
  );
});
