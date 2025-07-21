export const docs = {
  toast: {
    title: '토스트 알림',
    description: `
      <code>ag-toast</code> 컴포넌트는 다양한 타입의 알림 메시지를 화면에 표시합니다.
      <strong>showToast(message, type)</strong> 메서드를 통해 알림을 표시할 수 있으며,
      알림이 닫히면 <strong>onClose</strong> 커스텀 이벤트가 발생합니다.

      - 타입: <code>'success'</code>, <code>'error'</code>, <code>'warning'</code>, <code>'info'</code>
      - 동일 메시지 반복 시, 알림은 중복 생성되지 않고 <strong>횟수</strong>만 갱신됩니다.
      - 내부적으로 일정 시간 동안 중복 메시지를 캐시하여 <strong>중복 발생을 방지</strong>합니다.
    `,
    code: `
      // 토스트 요소 참조
      const toast = document.querySelector('ag-toast');

      // 알림 표시 (기본: info)
      toast?.showToast('정보 메시지입니다.', 'info');

      // 에러 메시지 표시
      toast?.showToast('오류가 발생했습니다.', 'error');

      // 동일 메시지 중복 호출 시 count만 증가 (새로 추가되지 않음)
      toast?.showToast('정보 메시지입니다.', 'info');

      // 닫힘 이벤트 핸들링
      toast?.addEventListener('onClose', (e) => {
        const { message, type, count } = (e as CustomEvent).detail;
        console.log(\`닫힘: \${type} - \${message} (\${count}회 발생)\`);
      });
    `,
  },
};
