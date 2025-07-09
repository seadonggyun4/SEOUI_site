import { component$, useSignal, $, useVisibleTask$ } from '@builder.io/qwik';
import { messengerContentData, type ChatMessage } from './content';
import './style.scss';

export default component$(() => {
  const activeLang = useSignal('en');
  const chatInput = useSignal('');
  const messages = useSignal<ChatMessage[]>([]);
  const isUserAuthenticated = useSignal(false);
  const userName = useSignal('');

  // 인증 상태 확인 및 리다이렉트
  useVisibleTask$(() => {
    try {
      const foreignerAppData = sessionStorage.getItem('foreignerApp');
      if (foreignerAppData) {
        const parsedData = JSON.parse(foreignerAppData);
        if (parsedData.userName && parsedData.userName.trim()) {
          isUserAuthenticated.value = true;
          userName.value = parsedData.userName;
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
    }, 1000);
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

  // 플로팅 버튼 클릭 핸들러 (인증된 사용자만 접근)
  const handleFloatingBtnClick = $(() => {
    const menu = document.getElementById('circularMenu');
    menu?.classList.toggle('active');
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
          <div class="section-header">
            <h3>
              {currentContent.tabContents.chat.sections[0].heading} - Welcome, {userName.value}!
            </h3>
          </div>

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
                onInput$={(e) => chatInput.value = (e.target as HTMLTextAreaElement).value}
                onKeyDown$={handleKeyDown}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Circular Menu */}
      <div id="circularMenu" class="circular-menu">
        <a class="floating-btn" onClick$={handleFloatingBtnClick}>
          <i class="fa fa-plus"></i>
        </a>
        {/* 인증된 사용자 메뉴 아이템 */}
        <menu class="items-wrapper">
          <a href="/angelcar-info-foreigner/info" class="menu-item fa fa-book" title="공지사항">공지사항</a>
          <a href="#" class="menu-item fa fa-bookmark" title="예약조회">예약조회</a>
          <a href="/angelcar-info-foreigner/message" class="menu-item fa fa-comment-dots" title="메시지">메시지</a>
          <div
            class="menu-item fa fa-language"
            title="언어선택"
            onClick$={() => {
              activeLang.value = activeLang.value === 'en' ? 'zh' : 'en';
            }}
          >언어선택</div>
        </menu>
      </div>
    </div>
  );
});