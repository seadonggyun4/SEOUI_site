// src/routes/angelcar-info-foreigner/message/index.tsx
import { component$, useSignal, $, useVisibleTask$, useContext } from '@builder.io/qwik';
import { GlobalStateContext } from '../store';
import { requireAuth } from '../store/authUtils';
import { messengerContentData, type ChatMessage } from './content';
import './style.scss';

export default component$(() => {
  const globalState = useContext(GlobalStateContext);
  const chatInput = useSignal('');
  const messages = useSignal<ChatMessage[]>([]);

  // 인증 확인 및 리다이렉트
  useVisibleTask$(() => {
    requireAuth();

    // 초기 스크롤 설정
    setTimeout(() => scrollToBottom(), 100);
  });

  // 스크롤을 최하단으로 이동하는 함수
  const scrollToBottom = $(() => {
    requestAnimationFrame(() => {
      const messagesArea = document.querySelector('.messages-area');
      if (messagesArea) {
        messagesArea.scrollTop = messagesArea.scrollHeight;
      }
    });
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
        setTimeout(() => scrollToBottom(), 300);
      } else if (heightDifference <= 150 && isKeyboardOpen) {
        isKeyboardOpen = false;
        setTimeout(() => scrollToBottom(), 100);
      }
    };

    // 입력창 포커스 이벤트
    const textarea = document.querySelector('.chat-input-area textarea');
    const handleFocus = () => {
      setTimeout(() => scrollToBottom(), 500);
    };

    const handleBlur = () => {
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
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
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
        message: globalState.activeLang.value === 'en'
          ? "Thank you for your message. Our team will respond shortly."
          : "感謝您的訊息。我們的團隊將很快回覆。",
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        isRead: false
      };
      messages.value = [...messages.value, autoReply];

      // 자동 응답 후 스크롤
      setTimeout(() => scrollToBottom(), 50);
    }, 500);
  });

  // 엔터 키 핸들러
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

  const currentContent = messengerContentData[globalState.activeLang.value as keyof typeof messengerContentData];

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
            {currentContent.tabContents.chat.sections[0].heading} - Welcome, {globalState.userName.value}!
          </h3>

          <div class="chat-container">
            <div class="messages-area">
              {currentContent.tabContents.chat.sections[0].messages &&
                renderMessages(currentContent.tabContents.chat.sections[0].messages)}
            </div>

            {/* 인증된 사용자 입력창 */}
            <div class="chat-input-area">
              <textarea
                placeholder={globalState.activeLang.value === 'en' ? "Type your message..." : "請輸入您的訊息..."}
                value={chatInput.value}
                onInput$={handleInput}
                onKeyDown$={handleKeyDown}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
});