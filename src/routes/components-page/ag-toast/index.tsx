import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { docs } from './docs';

interface AgToastElement extends HTMLElement {
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default component$(() => {
  useVisibleTask$(() => {
    // ag-toast 등록 및 이벤트 연결
    const toast = document.querySelector('ag-toast') as AgToastElement | null;

    if (toast) {
      toast.addEventListener('onClose', (e) => {
        const { message, type, count } = (e as CustomEvent).detail;
        console.log(`[Toast 종료] ${type} - ${message} (${count}회)`);
      });
    }

    const $buttons = document.querySelectorAll('button[name]');
    $buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('name') as 'success' | 'error' | 'info' | 'warning';
        toast?.showToast(`${type} 메시지입니다`, type);
      });
    });
  });

  return (
    <>
      <DocSection {...docs.toast}>
        <button name="info">알림</button>
        <button name="warning">경고</button>
        <button name="error">에러</button>
        <button name="success">성공</button>
        <ag-toast></ag-toast>
      </DocSection>
    </>
  );
});
