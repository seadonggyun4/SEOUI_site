// angelcar-info-foreigner/components/Footer.tsx
import { component$, useContext, $ } from '@builder.io/qwik';
import { GlobalStateContext } from '../store';

export default component$(() => {
  const globalState = useContext(GlobalStateContext);

  const handleMessageClick = $(() => {
    // 메시지 읽음 처리
    globalState.hasUnreadMessages.value = false;
    localStorage.setItem('unreadMessages', 'false');

    // 메시지 페이지로 이동
    window.location.href = '/angelcar-info-foreigner/message';
  });

  const handleLogout = $(() => {
    try {
      const check = confirm('로그아웃을 진행하시겠습니까?');
      if (!check) return;

      // 세션 데이터 정리
      sessionStorage.removeItem('foreignerApp');
      localStorage.removeItem('unreadMessages');

      // 전역 상태 초기화
      globalState.isUserAuthenticated.value = false;
      globalState.userName.value = '';
      globalState.hasUnreadMessages.value = false;

      // 메인 페이지로 이동
      window.location.href = '/angelcar-info-foreigner/info/';
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  });

  return (
    <footer class="footer">
      <menu>
        {/* 공지사항 - 항상 표시 */}
        <a href="/angelcar-info-foreigner/info" class="menu-item fa-solid fa-house" title="공지사항"></a>

        {/* 로그인 안된 경우 */}
        {!globalState.isUserAuthenticated.value && (
          <a href="/angelcar-info-foreigner/user" class="menu-item fa fa-user" title="인증"></a>
        )}

        {/* 로그인 된 경우 */}
        {globalState.isUserAuthenticated.value && (
          <>
            <a href="#" class="menu-item fa-solid fa-car" title="예약조회"></a>

            {/* 메시지 아이콘 (읽지 않은 메시지 표시기 포함) */}
            <div class="menu-item-wrapper" onClick$={handleMessageClick}>
              <a href="#" class="menu-item fa fa-comment-dots" title="메시지"></a>
              {globalState.hasUnreadMessages.value && (
                <div class="message-indicator">
                  <div class="indicator-dot"></div>
                  <div class="indicator-pulse"></div>
                </div>
              )}
            </div>

            <a
              href="#"
              class="menu-item fa-solid fa-right-from-bracket"
              title="로그아웃"
              onClick$={handleLogout}
            ></a>
          </>
        )}
      </menu>
    </footer>
  );
});