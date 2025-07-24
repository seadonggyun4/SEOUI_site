export const docs = {
  basic: {
    title: '기본 토스트 사용법',
    description: `
      <code>ag-toast</code>는 사용자에게 알림 메시지를 표시하는 컴포넌트입니다.

      <strong>showToast(message, type, options)</strong> 메서드를 통해 알림을 표시할 수 있으며,
      4가지 타입의 알림을 지원합니다:

      - <code>'success'</code>: 성공 메시지 (체크 아이콘)
      - <code>'error'</code>: 오류 메시지 (X 아이콘)
      - <code>'warning'</code>: 경고 메시지 (삼각형 아이콘)
      - <code>'info'</code>: 정보 메시지 (정보 아이콘, 기본값)

      각 알림은 자동으로 닫히며, 수동으로도 닫기 버튼을 통해 닫을 수 있습니다.
    `,
    code: `
      <!-- HTML에 토스트 컴포넌트 배치 -->
      <ag-toast id="main-toast"></ag-toast>

      <script>
        const toast = document.getElementById('main-toast');

        // 기본 정보 메시지
        toast.showToast('작업이 완료되었습니다.');

        // 성공 메시지
        toast.showToast('데이터가 성공적으로 저장되었습니다.', 'success');

        // 오류 메시지
        toast.showToast('네트워크 연결에 실패했습니다.', 'error');

        // 경고 메시지
        toast.showToast('입력된 데이터를 확인해주세요.', 'warning');
      </script>
    `,
    lang: 'html'
  },

  timing: {
    title: '표시 시간 설정',
    description: `
      토스트 알림의 표시 시간을 제어할 수 있습니다:

      - <strong>closeTime</strong> 속성: 컴포넌트 전체의 기본 표시 시간 설정 (기본값: 2000ms)
      - <strong>options.closeTime</strong>: 개별 토스트의 표시 시간 설정 (개별 설정이 우선 적용)

      표시 시간이 지나면 토스트는 자동으로 사라지며, 사용자가 닫기 버튼을 클릭해도 즉시 닫힙니다.
      짧은 시간(1초 미만)으로 설정하면 사용자가 메시지를 읽기 어려울 수 있으므로 주의가 필요합니다.
    `,
    code: `
      <ag-toast id="timing-toast"></ag-toast>

      <script>
        const toast = document.getElementById('timing-toast');

        // 컴포넌트 전체 기본 시간 설정 (5초)
        toast.closeTime = 5000;

        // 기본 시간으로 표시 (5초 후 자동 닫힘)
        toast.showToast('기본 시간으로 표시되는 메시지', 'info');

        // 개별 시간 설정 (3초, 기본값 무시)
        toast.showToast('3초 후 닫히는 메시지', 'success', {
          closeTime: 3000
        });

        // 긴 시간 설정 (10초)
        toast.showToast('10초간 표시되는 중요한 메시지', 'warning', {
          closeTime: 10000
        });

        // 짧은 시간 설정 (1초)
        toast.showToast('빠르게 사라지는 메시지', 'error', {
          closeTime: 1000
        });
      </script>
    `,
    lang: 'html'
  },

  duplicate: {
    title: '중복 메시지 처리',
    description: `
      <code>ag-toast</code>는 중복 메시지 발생을 효과적으로 처리합니다:

      - 동일한 <strong>타입 + 메시지</strong> 조합이 표시 시간 내에 다시 호출되면 새로운 토스트를 생성하지 않습니다
      - 대신 기존 토스트의 <strong>발생 횟수</strong>만 증가시키고 표시 시간을 연장합니다
      - 내부적으로 <strong>10초간</strong> 메시지 캐시를 유지하여 중복을 방지합니다
      - <strong>"N회 발생"</strong> 텍스트가 토스트 제목 옆에 표시됩니다

      이 기능으로 동일한 알림이 여러 번 발생해도 화면이 토스트로 가득 차는 것을 방지할 수 있습니다.
    `,
    code: `
      <ag-toast id="duplicate-toast"></ag-toast>

      <script>
        const toast = document.getElementById('duplicate-toast');

        // 같은 메시지를 여러 번 호출
        toast.showToast('데이터 저장 완료', 'success');

        // 1초 후 같은 메시지 재호출 - 새 토스트가 생성되지 않고 횟수만 증가
        setTimeout(() => {
          toast.showToast('데이터 저장 완료', 'success'); // "2회 발생" 표시
        }, 1000);

        // 2초 후 또 다시 호출
        setTimeout(() => {
          toast.showToast('데이터 저장 완료', 'success'); // "3회 발생" 표시
        }, 2000);

        // 다른 타입이면 별개의 토스트로 처리됨
        toast.showToast('데이터 저장 완료', 'info'); // 새로운 토스트 생성

        // 메시지가 다르면 별개의 토스트로 처리됨
        toast.showToast('파일 저장 완료', 'success'); // 새로운 토스트 생성
      </script>
    `,
    lang: 'html'
  },

  events: {
    title: '이벤트 처리',
    description: `
      토스트가 닫힐 때 <strong>onClose</strong> 커스텀 이벤트가 발생합니다.

      이벤트 세부 정보(<code>event.detail</code>):
      - <strong>message</strong>: 토스트에 표시된 메시지 텍스트
      - <strong>type</strong>: 토스트 타입 ('success', 'error', 'warning', 'info')
      - <strong>count</strong>: 해당 메시지가 발생한 총 횟수

      이벤트는 <code>bubbles: true, composed: true</code>로 설정되어
      상위 요소에서도 캐치할 수 있으며, Shadow DOM 경계를 넘어 전파됩니다.
    `,
    code: `
      <ag-toast id="event-toast"></ag-toast>

      <script>
        const toast = document.getElementById('event-toast');

        // 토스트 닫힘 이벤트 리스너 등록
        toast.addEventListener('onClose', (event) => {
          const { message, type, count } = event.detail;

          console.log(\`토스트 닫힘: [\${type.toUpperCase()}] \${message}\`);
          console.log(\`발생 횟수: \${count}회\`);

          // 타입별 후속 처리
          if (type === 'error') {
            // 에러 토스트가 닫힌 경우 로그 전송
            sendErrorLog(message, count);
          } else if (type === 'success' && count > 1) {
            // 성공 메시지가 여러 번 발생한 경우
            console.log('반복적인 성공 작업이 수행되었습니다.');
          }
        });

        // 상위 요소에서도 이벤트 캐치 가능
        document.addEventListener('onClose', (event) => {
          console.log('전역 토스트 이벤트:', event.detail);
        });

        // 테스트용 토스트 표시
        toast.showToast('이벤트 테스트 메시지', 'info');

        function sendErrorLog(message, count) {
          // 실제 구현에서는 서버로 에러 로그 전송
          console.log(\`에러 로그 전송: \${message} (발생횟수: \${count})\`);
        }
      </script>
    `,
    lang: 'html'
  },

  positioning: {
    title: '토스트 배치 및 스타일링',
    description: `
      <code>ag-toast</code>는 <strong>Light DOM</strong>을 사용하여 스타일링이 용이합니다:

      - 토스트 컨테이너(<code>.toast-container</code>)에 CSS를 적용하여 위치 조정 가능
      - 개별 토스트(<code>.toast</code>)의 외관을 자유롭게 커스터마이징 가능
      - 타입별 클래스(<code>.toast--success</code>, <code>.toast--error</code> 등) 제공
      - 애니메이션 클래스(<code>.toast--enter</code>, <code>.toast--exit</code>) 제공

      기본적으로 토스트는 컨테이너 상단에 <code>prepend</code> 방식으로 추가되어
      최신 알림이 맨 위에 표시됩니다.
    `,
    code: `
      <style>
        /* 토스트 컨테이너를 화면 우상단에 고정 */
        ag-toast .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          max-width: 400px;
        }

        /* 개별 토스트 스타일 커스터마이징 */
        ag-toast .toast {
          margin-bottom: 12px;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: white;
          border-left: 4px solid #e5e7eb;
        }

        /* 타입별 색상 */
        ag-toast .toast--success { border-left-color: #10b981; }
        ag-toast .toast--error { border-left-color: #ef4444; }
        ag-toast .toast--warning { border-left-color: #f59e0b; }
        ag-toast .toast--info { border-left-color: #3b82f6; }

        /* 애니메이션 */
        ag-toast .toast--enter {
          transform: translateX(100%);
          opacity: 0;
        }

        ag-toast .toast {
          transition: all 0.3s ease;
          transform: translateX(0);
          opacity: 1;
        }

        ag-toast .toast--exit {
          transform: translateX(100%);
          opacity: 0;
        }
      </style>

      <ag-toast id="styled-toast"></ag-toast>

      <script>
        const toast = document.getElementById('styled-toast');
        toast.showToast('스타일이 적용된 토스트입니다.', 'success');
      </script>
    `,
    lang: 'html'
  },

  advanced: {
    title: '고급 사용법 및 최적화',
    description: `
      <code>ag-toast</code>의 고급 기능과 성능 최적화 방법:

      **메모리 관리**:
      - 내부적으로 <strong>5초마다</strong> 만료된 메시지 캐시를 정리합니다
      - 컴포넌트가 DOM에서 제거되면 정리 인터벌이 자동으로 해제됩니다
      - <strong>10초</strong> 이상 지난 캐시는 자동으로 삭제되어 메모리 누수를 방지합니다

      **동적 사용**:
      - JavaScript로 동적으로 생성하여 필요할 때만 DOM에 추가 가능
      - 여러 개의 토스트 컨테이너를 사용하여 용도별 분리 가능
      - 싱글톤 패턴으로 전역 토스트 관리자 구현 가능
    `,
    code: `
      <script>
        // 동적 토스트 컨테이너 생성
        class ToastManager {
          private static instance: ToastManager;
          private toastElement: HTMLElement;

          private constructor() {
            this.toastElement = document.createElement('ag-toast');
            this.toastElement.id = 'global-toast';
            document.body.appendChild(this.toastElement);
          }

          static getInstance() {
            if (!ToastManager.instance) {
              ToastManager.instance = new ToastManager();
            }
            return ToastManager.instance;
          }

          show(message: string, type = 'info', options = {}) {
            (this.toastElement as any).showToast(message, type, options);
          }

          destroy() {
            this.toastElement.remove();
            ToastManager.instance = null;
          }
        }

        // 전역 토스트 매니저 사용
        const toastManager = ToastManager.getInstance();

        // API 응답에 따른 토스트 처리
        async function saveData(data) {
          try {
            toastManager.show('데이터 저장 중...', 'info', { closeTime: 1000 });

            const response = await fetch('/api/save', {
              method: 'POST',
              body: JSON.stringify(data)
            });

            if (response.ok) {
              toastManager.show('데이터가 성공적으로 저장되었습니다.', 'success');
            } else {
              throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
            }
          } catch (error) {
            toastManager.show(\`저장 실패: \${error.message}\`, 'error');
          }
        }

        // 여러 용도별 토스트 컨테이너 분리
        const systemToast = document.createElement('ag-toast');
        const userToast = document.createElement('ag-toast');

        systemToast.className = 'system-toast';
        userToast.className = 'user-toast';

        document.body.appendChild(systemToast);
        document.body.appendChild(userToast);

        // 시스템 알림
        systemToast.showToast('시스템 업데이트가 완료되었습니다.', 'info');

        // 사용자 액션 알림
        userToast.showToast('프로필이 업데이트되었습니다.', 'success');
      </script>
    `,
    lang: 'javascript'
  }
};