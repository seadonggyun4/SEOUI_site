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
      {/* 높은 우선순위 - 즉시 로드 */}
      <DocSection
        {...docs.size}
        priority="high"
        enableStreaming={true}
      >
        <ag-button size="large" width="100px">확인</ag-button>
        <ag-button width="100px">확인</ag-button>
        <ag-button size="small" width="100px">확인</ag-button>
      </DocSection>

      {/* 중간 우선순위 - 300ms 지연 */}
      <DocSection
        {...docs.variant}
        priority="medium"
        enableStreaming={true}
      >
        <ag-button variant="primary" width="100px">확인</ag-button>
        <ag-button variant="error" width="100px">확인</ag-button>
        <ag-button variant="warning" width="100px">확인</ag-button>
        <ag-button variant="success" width="100px">확인</ag-button>
        <ag-button variant="white" width="100px">확인</ag-button>
      </DocSection>

      {/* 낮은 우선순위 - 800ms 지연 */}
      <DocSection
        {...docs.disabled}
        priority="low"
        enableStreaming={true}
      >
        <ag-button width="100px">활성화</ag-button>
        <ag-button width="100px" disabled>비활성화</ag-button>
      </DocSection>

      {/* 커스텀 지연 시간 */}
      <DocSection
        {...docs.loading}
        streamDelay={500}
        enableStreaming={true}
      >
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

      {/* 스트리밍 비활성화 - 즉시 로드 */}
      <DocSection
        {...docs.submit}
        enableStreaming={false}
      >
        <form preventdefault:submit onSubmit$={formSubmit}>
          <input type="text" name="dummy" style={{ display: 'none' }} />
          <ag-button type="submit">테스트</ag-button>
        </form>
      </DocSection>
    </>
  );
});