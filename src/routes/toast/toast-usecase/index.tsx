import { component$, $, useVisibleTask$ } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { docs } from './docs';

interface AgToastElement extends HTMLElement {
  showToast: (
    message: string,
    type?: 'success' | 'error' | 'info' | 'warning',
    options?: { closeTime?: number }
  ) => void;
  closeTime: number;
}

export default component$(() => {
  useVisibleTask$(() => {
    import('@/components/ag-toast').then((mod) => {
      if (!customElements.get('ag-toast')) {
        customElements.define('ag-toast', mod.AgToast);
      }

      // 기본 토스트 설정
      const basicToast = document.getElementById('basic-toast') as AgToastElement;
      if (basicToast) {
        basicToast.addEventListener('onClose', (e: Event) => {
          const { message, type, count } = (e as CustomEvent).detail;
          console.log(`[Basic Toast] ${type.toUpperCase()}: ${message} (${count}회 발생)`);
        });
      }

      // 타이밍 토스트 설정
      const timingToast = document.getElementById('timing-toast') as AgToastElement;
      if (timingToast) {
        timingToast.closeTime = 5000; // 기본 5초 설정
      }

      // 이벤트 토스트 설정
      const eventToast = document.getElementById('event-toast') as AgToastElement;
      if (eventToast) {
        eventToast.addEventListener('onClose', (e: Event) => {
          const { message, type, count } = (e as CustomEvent).detail;
          const log = document.getElementById('event-log');
          if (log) {
            const timestamp = new Date().toLocaleTimeString();
            log.innerHTML += `<div>[${timestamp}] <strong>${type.toUpperCase()}</strong>: ${message} <span class="count">(${count}회 발생)</span></div>`;
            log.scrollTop = log.scrollHeight;
          }
        });
      }

      // 스타일링 토스트는 CSS로 처리되므로 별도 설정 불필요

      // 고급 사용법 - 동적 토스트 매니저 (데모용)
      const advancedContainer = document.getElementById('advanced-container');
      if (advancedContainer) {
        const dynamicToast = document.createElement('ag-toast');
        dynamicToast.id = 'dynamic-toast';
        advancedContainer.appendChild(dynamicToast);
      }
    });
  });

  // 기본 토스트 버튼 핸들러들
  const showBasicInfo = $(() => {
    const toast = document.getElementById('basic-toast') as AgToastElement;
    toast?.showToast('기본 정보 메시지입니다.');
  });

  const showBasicSuccess = $(() => {
    const toast = document.getElementById('basic-toast') as AgToastElement;
    toast?.showToast('데이터가 성공적으로 저장되었습니다.', 'success');
  });

  const showBasicError = $(() => {
    const toast = document.getElementById('basic-toast') as AgToastElement;
    toast?.showToast('네트워크 연결에 실패했습니다.', 'error');
  });

  const showBasicWarning = $(() => {
    const toast = document.getElementById('basic-toast') as AgToastElement;
    toast?.showToast('입력된 데이터를 확인해주세요.', 'warning');
  });

  // 타이밍 토스트 핸들러들
  const showDefaultTiming = $(() => {
    const toast = document.getElementById('timing-toast') as AgToastElement;
    toast?.showToast('기본 시간으로 표시되는 메시지 (5초)', 'info');
  });

  const showShortTiming = $(() => {
    const toast = document.getElementById('timing-toast') as AgToastElement;
    toast?.showToast('3초 후 닫히는 메시지', 'success', { closeTime: 3000 });
  });

  const showLongTiming = $(() => {
    const toast = document.getElementById('timing-toast') as AgToastElement;
    toast?.showToast('10초간 표시되는 중요한 메시지', 'warning', { closeTime: 10000 });
  });

  const showVeryShort = $(() => {
    const toast = document.getElementById('timing-toast') as AgToastElement;
    toast?.showToast('1초만 표시되는 빠른 메시지', 'error', { closeTime: 1000 });
  });

  // 중복 메시지 테스트 핸들러들
  const showDuplicateMessage = $(() => {
    const toast = document.getElementById('duplicate-toast') as AgToastElement;
    toast?.showToast('데이터 저장 완료', 'success');
  });

  const showDifferentType = $(() => {
    const toast = document.getElementById('duplicate-toast') as AgToastElement;
    toast?.showToast('데이터 저장 완료', 'info'); // 같은 메시지, 다른 타입
  });

  const showDifferentMessage = $(() => {
    const toast = document.getElementById('duplicate-toast') as AgToastElement;
    toast?.showToast('파일 저장 완료', 'success'); // 다른 메시지, 같은 타입
  });

  // 이벤트 테스트 핸들러들
  const showEventTest = $(() => {
    const toast = document.getElementById('event-toast') as AgToastElement;
    toast?.showToast('이벤트 테스트 메시지', 'info');
  });

  const showMultipleEvents = $(() => {
    const toast = document.getElementById('event-toast') as AgToastElement;
    // 연속으로 여러 타입의 토스트 표시
    toast?.showToast('연속 테스트 - 성공', 'success');
    setTimeout(() => toast?.showToast('연속 테스트 - 경고', 'warning'), 500);
    setTimeout(() => toast?.showToast('연속 테스트 - 에러', 'error'), 1000);
  });

  const clearEventLog = $(() => {
    const log = document.getElementById('event-log');
    if (log) log.innerHTML = '';
  });

  // 스타일링 토스트 핸들러들
  const showStyledToast = $(() => {
    const toast = document.getElementById('styled-toast') as AgToastElement;
    toast?.showToast('커스텀 스타일이 적용된 토스트입니다.', 'success');
  });

  const showStyledTypes = $(() => {
    const toast = document.getElementById('styled-toast') as AgToastElement;
    const types: Array<'success' | 'error' | 'warning' | 'info'> = ['success', 'error', 'warning', 'info'];

    types.forEach((type, index) => {
      setTimeout(() => {
        toast?.showToast(`${type.toUpperCase()} 스타일 토스트`, type);
      }, index * 300);
    });
  });

  // 고급 사용법 핸들러들
  const simulateApiCall = $(() => {
    const toast = document.getElementById('dynamic-toast') as AgToastElement;
    if (!toast) return;

    // API 호출 시뮬레이션
    toast.showToast('데이터 저장 중...', 'info', { closeTime: 1000 });

    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% 성공률

      if (success) {
        toast.showToast('데이터가 성공적으로 저장되었습니다.', 'success');
      } else {
        toast.showToast('저장 실패: 네트워크 오류가 발생했습니다.', 'error');
      }
    }, 2000);
  });

  const testMemoryManagement = $(() => {
    const toast = document.getElementById('dynamic-toast') as AgToastElement;
    if (!toast) return;

    // 메모리 관리 테스트 - 빠르게 많은 토스트 생성
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        toast.showToast('메모리 테스트 메시지', 'info');
      }, i * 200);
    }
  });

  return (
    <>
      <DocSection {...docs.basic}>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>기본 토스트 타입들</h4>
            <div class="button-group">
              <button type="button" onClick$={showBasicInfo} class="gradient-btn">
                정보 메시지
              </button>
              <button type="button" onClick$={showBasicSuccess} class="gradient-btn">
                성공 메시지
              </button>
              <button type="button" onClick$={showBasicError} class="gradient-btn">
                오류 메시지
              </button>
              <button type="button" onClick$={showBasicWarning} class="gradient-btn">
                경고 메시지
              </button>
            </div>
            <div dangerouslySetInnerHTML={`<ag-toast id="basic-toast"></ag-toast>`} />
            <p class="demo-note">
              💬 각 버튼을 클릭하여 다양한 타입의 토스트를 확인해보세요
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection {...docs.timing}>
        <div class="demo-item">
          <div class="button-group">
            <button type="button" onClick$={showDefaultTiming} class="gradient-btn">
              기본 시간 (5초)
            </button>
            <button type="button" onClick$={showShortTiming} class="gradient-btn">
              짧은 시간 (3초)
            </button>
            <button type="button" onClick$={showLongTiming} class="gradient-btn">
              긴 시간 (10초)
            </button>
            <button type="button" onClick$={showVeryShort} class="gradient-btn">
              매우 짧음 (1초)
            </button>
          </div>
          <div dangerouslySetInnerHTML={`<ag-toast id="timing-toast"></ag-toast>`} />
          <p class="demo-note">
            ⏱️ 각기 다른 표시 시간으로 토스트가 나타납니다
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.duplicate}>
        <div class="demo-item">
          <div class="button-group">
            <button type="button" onClick$={showDuplicateMessage} class="gradient-btn">
              같은 메시지 반복
            </button>
            <button type="button" onClick$={showDifferentType} class="gradient-btn">
              같은 메시지, 다른 타입
            </button>
            <button type="button" onClick$={showDifferentMessage} class="gradient-btn">
              다른 메시지, 같은 타입
            </button>
          </div>
          <div dangerouslySetInnerHTML={`<ag-toast id="duplicate-toast"></ag-toast>`} />
          <p class="demo-note">
            🔄 "같은 메시지 반복" 버튼을 여러 번 눌러 중복 처리를 확인해보세요
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.events}>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>이벤트 발생 테스트</h4>
            <div class="button-group">
              <button type="button" onClick$={showEventTest} class="gradient-btn">
                단일 이벤트
              </button>
              <button type="button" onClick$={showMultipleEvents} class="gradient-btn">
                연속 이벤트
              </button>
              <button type="button" onClick$={clearEventLog} class="gradient-btn clear">
                로그 지우기
              </button>
            </div>
            <div dangerouslySetInnerHTML={`<ag-toast id="event-toast"></ag-toast>`} />
          </div>

          <div class="demo-item">
            <h4>이벤트 로그</h4>
            <div id="event-log" class="event-log"></div>
            <p class="demo-note">
              📋 토스트가 닫힐 때마다 이벤트 정보가 실시간으로 표시됩니다
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection {...docs.positioning}>
        <div class="demo-item">
          <div class="button-group">
            <button type="button" onClick$={showStyledToast} class="gradient-btn">
              스타일 토스트
            </button>
            <button type="button" onClick$={showStyledTypes} class="gradient-btn">
              모든 타입 표시
            </button>
          </div>

          {/* 커스텀 스타일이 적용된 토스트 */}
          <style dangerouslySetInnerHTML={`
            #styled-toast .toast-container {
              position: fixed;
              top: 20px;
              right: 20px;
              z-index: 9999;
              max-width: 400px;
            }

            #styled-toast .toast {
              margin-bottom: 12px;
              padding: 16px;
              border-radius: 12px;
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
              display: flex;
              align-items: flex-start;
              gap: 12px;
              background: white;
              border-left: 4px solid #e5e7eb;
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }

            #styled-toast .toast--success {
              border-left-color: #10b981;
              background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
            }
            #styled-toast .toast--error {
              border-left-color: #ef4444;
              background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
            }
            #styled-toast .toast--warning {
              border-left-color: #f59e0b;
              background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
            }
            #styled-toast .toast--info {
              border-left-color: #3b82f6;
              background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
            }

            #styled-toast .toast--enter {
              transform: translateX(100%) scale(0.9);
              opacity: 0;
            }

            #styled-toast .toast {
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              transform: translateX(0) scale(1);
              opacity: 1;
            }

            #styled-toast .toast--exit {
              transform: translateX(100%) scale(0.9);
              opacity: 0;
            }

            #styled-toast .toast__icon-wrapper {
              font-size: 1.2em;
            }

            #styled-toast .toast--success .toast__icon-wrapper { color: #10b981; }
            #styled-toast .toast--error .toast__icon-wrapper { color: #ef4444; }
            #styled-toast .toast--warning .toast__icon-wrapper { color: #f59e0b; }
            #styled-toast .toast--info .toast__icon-wrapper { color: #3b82f6; }
          `} />

          <div dangerouslySetInnerHTML={`<ag-toast id="styled-toast"></ag-toast>`} />
          <p class="demo-note">
            🎨 글래스모피즘과 그라데이션이 적용된 커스텀 스타일 토스트입니다
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.advanced}>
        <div class="demo-item">
          <div class="button-group">
            <button type="button" onClick$={simulateApiCall} class="gradient-btn">
              API 호출 시뮬레이션
            </button>
            <button type="button" onClick$={testMemoryManagement} class="gradient-btn">
              메모리 관리 테스트
            </button>
          </div>
          <div id="advanced-container">
            {/* 동적으로 생성되는 토스트가 여기에 추가됩니다 */}
          </div>
          <p class="demo-note">
            🚀 고급 기능들을 테스트해보세요. API 시뮬레이션은 70% 성공률로 동작합니다
          </p>
        </div>
      </DocSection>
    </>
  );
});