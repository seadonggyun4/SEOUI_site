import { component$, $ } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { docs } from './docs'

interface PromiseElement extends HTMLElement {
  promise?: Promise<void>;
}

export default component$(() => {

  const handleClick = $((name: string) => {
    const btn = document.querySelector(`[name="${name}-loading"]`) as PromiseElement | null;
    const fakeAsync = new Promise<void>((resolve) => setTimeout(resolve, 2000));
    if (btn) btn.promise = fakeAsync;
  });

  const formSubmit = $((ev: SubmitEvent) => {
    const form = ev.target as HTMLFormElement;
    const submitButton = form.querySelector('ag-button') as PromiseElement | null;

    const asyncTask = new Promise<void>((resolve) => setTimeout(resolve, 1000));
    if (submitButton) submitButton.promise = asyncTask;

    asyncTask.then(() => {
      alert('폼 전송 완료');
    });
  });

  return (
    <>
      <DocSection {...docs.size}>
        <ag-button size="large" width="100px">확인</ag-button>
        <ag-button width="100px">확인</ag-button>
        <ag-button size="small" width="100px">확인</ag-button>
      </DocSection>

      <DocSection {...docs.variant}>
        <ag-button variant="primary" width="100px">확인</ag-button>
        <ag-button variant="error" width="100px">확인</ag-button>
        <ag-button variant="warning" width="100px">확인</ag-button>
        <ag-button variant="success" width="100px">확인</ag-button>
        <ag-button variant="white" width="100px">확인</ag-button>
      </DocSection>

      <DocSection {...docs.disabled}>
        <ag-button width="100px">활성화</ag-button>
        <ag-button width="100px" disabled>비활성화</ag-button>
      </DocSection>

      <DocSection {...docs.loading}>
        <ag-button size="large" width="100px" name="large-loading" onClick$={() => handleClick('large')}>
          전송
        </ag-button>
        <ag-button width="100px" name="basic-loading" onClick$={() => handleClick('basic')}>
          전송
        </ag-button>
        <ag-button size="small" width="100px" name="small-loading" onClick$={() => handleClick('small')}>
          전송
        </ag-button>
      </DocSection>

      <DocSection {...docs.submit}>
        <form preventdefault:submit onSubmit$={formSubmit}>
          <input type="text" name="dummy" style={{ display: 'none' }} />
          <ag-button type="submit">테스트</ag-button>
        </form>
      </DocSection>
    </>
  );
});
