import { component$, useSignal, $, useVisibleTask$ } from '@builder.io/qwik';
import { messengerContentData, type ChatMessage } from './content';
import './style.scss';

export default component$(() => {
  const activeLang = useSignal('en');
  const chatInput = useSignal('');
  const messages = useSignal<ChatMessage[]>([]);
  const isUserAuthenticated = useSignal(false);
  const userName = useSignal('');

  // 스크롤을 최하단으로 이동하는 함수
  const scrollToBottom = $(() => {
    requestAnimationFrame(() => {
      const messagesArea = document.querySelector('.messages-area');
      if (messagesArea) {
        messagesArea.scrollTop = messagesArea.scrollHeight;
      }
    });
  });

  // 인증 상태 확인 및 리다이렉트
  useVisibleTask$(() => {
    try {
      const foreignerAppData = sessionStorage.getItem('foreignerApp');
      if (foreignerAppData) {
        const parsedData = JSON.parse(foreignerAppData);
        if (parsedData.userName && parsedData.userName.trim()) {
          isUserAuthenticated.value = true;
          userName.value = parsedData.userName;

          // 초기 스크롤 설정
          setTimeout(() => scrollToBottom(), 100);
          return;
        }
      }

      // 인증되지 않은 경우 user 페이지로 리다이렉트
      window.location.href = '/angelcar-info-foreigner/user/';
    } catch (error) {
      console.error('Failed to parse foreignerApp data:', error);
      // 에러 발생 시에도 user 페이지로 리다이렉트
      window.location.href = '/angelcar-info-foreigner/user/';
    }
  });

  // 키보드 이벤트 처리 및 스크롤 관리
  useVisibleTask$(() => {
    let isKeyboardOpen = false;
    const initialViewportHeight = window.innerHeight;

    // 뷰포트 크기 변경 감지 (모바일 키보드)
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;

      // 키보드가 올라왔는지 판단 (150px 이상 차이)
      if (heightDifference > 150 && !isKeyboardOpen) {
        isKeyboardOpen = true;
        // 키보드가 올라올 때 스크롤 유지
        setTimeout(() => scrollToBottom(), 300);
      } else if (heightDifference <= 150 && isKeyboardOpen) {
        isKeyboardOpen = false;
        // 키보드가 내려갈 때도 스크롤 유지
        setTimeout(() => scrollToBottom(), 100);
      }
    };

    // 입력창 포커스 이벤트
    const textarea = document.querySelector('.chat-input-area textarea');
    const handleFocus = () => {
      // iOS Safari 대응: 약간의 지연 후 스크롤
      setTimeout(() => scrollToBottom(), 500);
    };

    const handleBlur = () => {
      // 포커스가 해제될 때도 스크롤 유지
      setTimeout(() => scrollToBottom(), 100);
    };

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);
    textarea?.addEventListener('focus', handleFocus);
    textarea?.addEventListener('blur', handleBlur);

    // 정리 함수
    return () => {
      window.removeEventListener('resize', handleResize);
      textarea?.removeEventListener('focus', handleFocus);
      textarea?.removeEventListener('blur', handleBlur);
    };
  });

  const sendMessage = $(() => {
    if (!chatInput.value.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: chatInput.value,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      isRead: false
    };

    messages.value = [...messages.value, newMessage];
    chatInput.value = '';

    // 메시지 전송 후 스크롤
    setTimeout(() => scrollToBottom(), 50);

    // 자동 응답 시뮬레이션
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'admin',
        message: activeLang.value === 'en'
          ? "Thank you for your message. Our team will respond shortly."
          : "感謝您的訊息。我們的團隊將很快回覆。",
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        isRead: false
      };
      messages.value = [...messages.value, autoReply];

      // 자동 응답 후 스크롤
      setTimeout(() => scrollToBottom(), 50);
    }, 500);
  });

  // 엔터 키 핸들러 분리
  const handleKeyDown = $((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();

      if (chatInput.value.trim()) {
        sendMessage();
        // 강제로 다시 한 번 초기화
        setTimeout(() => {
          chatInput.value = '';
        }, 0);
      }
    }
  });

  // 입력창 변경 시 스크롤 유지
  const handleInput = $((e: Event) => {
    chatInput.value = (e.target as HTMLTextAreaElement).value;
    // 타이핑 중에도 스크롤 유지
    setTimeout(() => scrollToBottom(), 10);
  });

  // 플로팅 버튼 클릭 핸들러 (인증된 사용자만 접근)
  const handleFloatingBtnClick = $(() => {
    const menu = document.getElementById('circularMenu');
    menu?.classList.toggle('active');
  });

  // 로그아웃 핸들러
  const handleLogout = $(() => {
    try {
      sessionStorage.removeItem('foreignerApp');
      isUserAuthenticated.value = false;
      userName.value = '';
      window.location.href = '/angelcar-info-foreigner/info/';
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  });

  const currentContent = messengerContentData[activeLang.value as keyof typeof messengerContentData];

  // 메시지 렌더링 함수
  const renderMessages = (defaultMessages: ChatMessage[]) => {
    const allMessages = [...defaultMessages, ...messages.value];

    return allMessages.map((message) => (
      <div key={message.id} class={`message ${message.sender}`}>
        <div class="message-content">
          <p>{message.message}</p>
          <span class="timestamp">{message.timestamp}</span>
        </div>
      </div>
    ));
  };

  return (
    <div class="container">
      {/* Header */}
      <header class="header">
        <div class="logo-container">
          <img src="/angelcar-info-foreigner/img/logo.png" alt="JEJU ANGEL RENT A CAR" />
        </div>
      </header>

      <main>
        <section class="messenger-content">
          {/* 인증된 사용자 환영 메시지 */}
          <h3 class="section-header">
            {currentContent.tabContents.chat.sections[0].heading} - Welcome, {userName.value}!
          </h3>

          <div class="chat-container">
            <div class="messages-area">
              {currentContent.tabContents.chat.sections[0].messages &&
                renderMessages(currentContent.tabContents.chat.sections[0].messages)}
            </div>

            {/* 인증된 사용자 입력창 */}
            <div class="chat-input-area">
              <textarea
                placeholder={activeLang.value === 'en' ? "Type your message..." : "請輸入您的訊息..."}
                value={chatInput.value}
                onInput$={handleInput}
                onKeyDown$={handleKeyDown}
              />
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <menu>
          {/* 공지사항 - 항상 표시 */}
          <a href="/angelcar-info-foreigner/info" class="menu-item fa fa-book" title="공지사항"></a>

          {/* 로그인 안되었을 때만 표시 */}
          {!isUserAuthenticated.value && (
            <a href="/angelcar-info-foreigner/user" class="menu-item fa fa-user" title="인증"></a>
          )}

          {/* 로그인 이후에만 표시 */}
          {isUserAuthenticated.value && (
            <>
              <a href="#" class="menu-item fa fa-bookmark" title="예약조회"></a>
              <a href="/angelcar-info-foreigner/message" class="menu-item fa fa-comment-dots" title="메시지"></a>
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

      {/* Circular language menu */}
      <div id="circularMenu" class="circular-menu">
        <a class="floating-btn" onClick$={handleFloatingBtnClick}>
          <i class="fa fa-language"></i>
        </a>
        <menu class="items-wrapper">
          <div
            class="menu-item"
            onClick$={() => {activeLang.value = 'en'}}
          >
            English
          </div>
          <div
            class="menu-item"
            onClick$={() => {activeLang.value = 'zh'}}
          >
            中文
          </div>
        </menu>
      </div>
    </div>
  );
});