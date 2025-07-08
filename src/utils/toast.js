/**
 * ag-toast 유틸 함수
 * @param {string} message
 * @param {'success' | 'error' | 'info' | 'warning'} type
 * @param {{ closeTime?: number, reloadAfterClose?: boolean, onClose?: () => void }} options
 *
 * EX)
 *
 * toast('저장되었습니다', 'success');
 *
 * toast('다시 불러오는 중입니다...', 'info', {
 *   closeTime: 3000,
 *  reloadAfterClose: true,
 * });
 *
 * toast('작업 완료', 'success', {
 *   onClose: () => console.log('닫혔습니다!')
 * });
 */
export function toast (message, type = 'info', options = {}) {
  const toastElement = document.querySelector('ag-toast')

  if (!toastElement || typeof toastElement.showToast !== 'function') {
    console.warn('[toast] ag-toast 요소가 없거나 showToast 메서드가 없습니다.')

    return
  }

  toastElement.showToast(message, type, options)
}
