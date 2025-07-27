export const docs = {
  basic: {
    title: '기본 날짜/시간 선택기 사용법',
    description: `
      <code>seo-datepicker</code>는 커스텀 캘린더 모달을 제공하는 날짜/시간 선택 컴포넌트입니다.

      - <strong>hidden</strong> 속성으로 모달 표시/숨김을 제어합니다 (기본값: true)
      - <code>open(rect, triggerEl, timeShow)</code>로 모달을 열고, <code>close()</code>로 닫습니다
      - <strong>date</strong>, <strong>time</strong> 속성으로 현재 선택된 값에 접근할 수 있습니다
      - <code>onChange</code> 이벤트로 사용자 선택을 감지하며, 이벤트에는 <code>{ date, time, id, name }</code> 정보가 포함됩니다
      - 기본적으로 시간 선택이 활성화되어 있으며, <code>open()</code> 메서드의 세 번째 인자로 제어 가능합니다
    `,
    code: `
      <input id="basic-input" type="datetime-local" placeholder="날짜/시간 선택" />
      <seo-datepicker id="datepicker-basic" hidden></seo-datepicker>

      <script>
        const input = document.getElementById('basic-input');
        const datepicker = document.getElementById('datepicker-basic');

        // 입력창 클릭 시 datepicker 열기
        input.addEventListener('click', () => {
          const rect = input.getBoundingClientRect();
          datepicker.open(rect, input, true); // 시간 선택 활성화
        });

        // 날짜/시간 선택 완료 시
        datepicker.addEventListener('onChange', (e) => {
          const { date, time } = e.detail;
          input.value = \`\${date}T\${time}\`;
          console.log('선택된 날짜/시간:', date, time);
        });
      </script>
    `,
    lang: 'html'
  },

  dateOnly: {
    title: '날짜만 선택 (시간 비활성화)',
    description: `
      <code>open()</code> 메서드의 세 번째 인자를 <strong>false</strong>로 설정하면 시간 선택 UI가 숨겨집니다.

      - 시간 선택이 비활성화되면 <strong>time-picker</strong> 영역이 렌더링되지 않습니다
      - footer의 시간 입력 필드도 함께 숨겨져 날짜만 입력 가능합니다
      - <code>onChange</code> 이벤트에서 <code>time</code> 값은 여전히 전달되지만, UI에서는 수정할 수 없습니다
      - 날짜만 필요한 경우 이 모드를 사용하여 UI를 단순화할 수 있습니다
    `,
    code: `
      <input id="date-only-input" type="date" placeholder="날짜만 선택" />
      <seo-datepicker id="datepicker-date-only" hidden></seo-datepicker>

      <script>
        const input = document.getElementById('date-only-input');
        const datepicker = document.getElementById('datepicker-date-only');

        input.addEventListener('click', () => {
          const rect = input.getBoundingClientRect();
          datepicker.open(rect, input, false); // 시간 선택 비활성화
        });

        datepicker.addEventListener('onChange', (e) => {
          const { date } = e.detail;
          input.value = date; // 날짜만 설정
        });
      </script>
    `,
    lang: 'html'
  },

  constraints: {
    title: '날짜 범위 제약 조건',
    description: `
      <strong>min-date</strong>, <strong>max-date</strong> 속성으로 선택 가능한 날짜 범위를 제한할 수 있습니다.

      - 제약 조건에 해당하지 않는 날짜는 <strong>disabled</strong> 클래스가 적용되어 선택할 수 없습니다
      - 시간까지 고려한 정확한 검증이 수행되며, 범위를 벗어나면 에러 메시지가 표시됩니다
      - <code>validateDateTime()</code> 메서드가 내부적으로 호출되어 실시간 검증을 수행합니다
      - 제약 조건은 <code>open()</code> 호출 시점에 설정하거나 속성으로 미리 지정할 수 있습니다
    `,
    code: `
      <!-- 오늘부터 30일 후까지만 선택 가능 -->
      <input id="constrained-input" type="datetime-local" />
      <seo-datepicker id="datepicker-constrained" hidden></seo-datepicker>

      <script>
        const input = document.getElementById('constrained-input');
        const datepicker = document.getElementById('datepicker-constrained');

        // 제약 조건 설정
        const today = new Date();
        const minDate = today.toISOString().split('T')[0];
        const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0];

        input.addEventListener('click', () => {
          // 속성으로 제약 조건 설정
          datepicker.setAttribute('min-date', minDate);
          datepicker.setAttribute('max-date', maxDate);

          const rect = input.getBoundingClientRect();
          datepicker.open(rect, input, true);
        });

        datepicker.addEventListener('onChange', (e) => {
          const { date, time } = e.detail;
          input.value = \`\${date}T\${time}\`;
        });
      </script>
    `,
    lang: 'html'
  },

  criteriaDate: {
    title: '기준일 표시 (criteria-date)',
    description: `
      <strong>criteria-date</strong> 속성을 설정하면 해당 날짜가 캘린더에서 <strong>criteria</strong> 클래스로 강조 표시됩니다.

      - 주로 날짜 범위 선택에서 시작일을 기준으로 종료일을 선택할 때 사용됩니다
      - 기준일은 시각적으로 구분되어 사용자가 쉽게 인지할 수 있습니다
      - 문자열 형태의 날짜(YYYY-MM-DD)로 설정하며, 시간 정보가 포함된 경우 자동으로 날짜 부분만 추출됩니다
      - 캘린더 렌더링 시 해당 날짜에 <code>criteria</code> CSS 클래스가 추가됩니다
    `,
    code: `
      <input id="start-date" type="date" placeholder="시작일" />
      ~
      <input id="end-date" type="date" placeholder="종료일" />
      <seo-datepicker id="datepicker-criteria" hidden></seo-datepicker>

      <script>
        const startInput = document.getElementById('start-date');
        const endInput = document.getElementById('end-date');
        const datepicker = document.getElementById('datepicker-criteria');

        startInput.addEventListener('click', () => {
          datepicker.removeAttribute('criteria-date'); // 기준일 초기화
          const rect = startInput.getBoundingClientRect();
          datepicker.open(rect, startInput, false);
        });

        endInput.addEventListener('click', () => {
          if (startInput.value) {
            // 시작일을 기준일로 설정
            datepicker.setAttribute('criteria-date', startInput.value);
          }
          const rect = endInput.getBoundingClientRect();
          datepicker.open(rect, endInput, false);
        });

        datepicker.addEventListener('onChange', (e) => {
          const { date, id } = e.detail;

          if (id === 'start-date') {
            startInput.value = date;
            // 시작일 선택 후 자동으로 종료일로 이동
            setTimeout(() => endInput.click(), 100);
          } else if (id === 'end-date') {
            endInput.value = date;
          }
        });
      </script>
    `,
    lang: 'html'
  },

  keyboard: {
    title: '키보드 인터랙션',
    description: `
      <code>seo-datepicker</code>는 포괄적인 키보드 네비게이션을 지원합니다.

      - <strong>Enter</strong>: 유효한 날짜/시간이 입력된 경우 선택 완료 및 모달 닫기
      - <strong>Escape</strong>: 모달 닫기 (변경사항 취소)
      - <strong>Tab</strong>: 입력 필드 간 이동 (날짜 → 시간 → 선택 버튼)
      - 모든 입력 필드에서 <strong>focus 시 자동 전체 선택</strong>이 적용됩니다
      - 키보드 이벤트는 <code>capture: true</code>로 설정되어 우선 처리됩니다
    `,
    code: `
      <input id="keyboard-input" type="datetime-local" />
      <seo-datepicker id="datepicker-keyboard" hidden></seo-datepicker>

      <script>
        const input = document.getElementById('keyboard-input');
        const datepicker = document.getElementById('datepicker-keyboard');

        input.addEventListener('click', () => {
          const rect = input.getBoundingClientRect();
          datepicker.open(rect, input, true);
        });

        datepicker.addEventListener('onChange', (e) => {
          const { date, time } = e.detail;
          input.value = \`\${date}T\${time}\`;
        });

        // Enter 키로 빠른 선택, ESC로 취소 가능
        // 포커스된 입력 필드에서 Tab으로 다음 필드로 이동
      </script>
    `,
    lang: 'html'
  },

  validation: {
    title: '입력 검증 및 에러 처리',
    description: `
      실시간 입력 검증을 통해 사용자에게 명확한 피드백을 제공합니다.

      - <strong>날짜 형식</strong>: YYYY-MM-DD 패턴 검증 및 실제 존재하는 날짜인지 확인
      - <strong>시간 형식</strong>: HH:MM 패턴 검증 및 23:30까지만 입력 허용
      - <strong>범위 검증</strong>: min-date, max-date 제약 조건 검증
      - <strong>월별 일수</strong>: 각 월의 마지막 날까지만 입력 허용 (윤년 고려)
      - 에러 발생 시 구체적인 메시지가 표시되며, 선택 버튼이 비활성화됩니다
    `,
    code: `
      <input id="validation-input" type="datetime-local" />
      <seo-datepicker id="datepicker-validation" hidden></seo-datepicker>

      <script>
        const input = document.getElementById('validation-input');
        const datepicker = document.getElementById('datepicker-validation');

        // 어제부터 내일까지만 선택 가능하도록 제한
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        input.addEventListener('click', () => {
          datepicker.setAttribute('min-date', yesterday.toISOString().split('T')[0]);
          datepicker.setAttribute('max-date', tomorrow.toISOString().split('T')[0]);

          const rect = input.getBoundingClientRect();
          datepicker.open(rect, input, true);
        });

        datepicker.addEventListener('onChange', (e) => {
          const { date, time } = e.detail;
          input.value = \`\${date}T\${time}\`;
        });

        // 범위를 벗어나는 날짜 입력 시 에러 메시지 표시
        // 잘못된 형식 입력 시 실시간 검증 및 피드백
      </script>
    `,
    lang: 'html'
  },

  formatting: {
    title: '자동 포맷팅 및 입력 보조',
    description: `
      사용자 입력을 실시간으로 포맷팅하여 편의성을 높입니다.

      - <strong>날짜 포맷팅</strong>: 숫자만 입력받아 YYYY-MM-DD 형태로 자동 변환
      - <strong>시간 포맷팅</strong>: 4자리 숫자를 HH:MM 형태로 변환하며, 분 단위는 00/30으로 자동 조정
      - <strong>커서 위치 보정</strong>: 포맷팅 후에도 사용자의 입력 위치를 적절히 유지
      - <strong>스마트 시간 입력</strong>: 15분 미만은 00분, 15-44분은 30분, 45분 이상은 다음 시간 00분으로 반올림
      - 날짜 입력 완료 시 자동으로 시간 입력 필드로 포커스 이동
    `,
    code: `
      <input id="formatting-input" type="datetime-local" />
      <seo-datepicker id="datepicker-formatting" hidden></seo-datepicker>

      <script>
        const input = document.getElementById('formatting-input');
        const datepicker = document.getElementById('datepicker-formatting');

        input.addEventListener('click', () => {
          const rect = input.getBoundingClientRect();
          datepicker.open(rect, input, true);
        });

        datepicker.addEventListener('onChange', (e) => {
          const { date, time } = e.detail;
          input.value = \`\${date}T\${time}\`;
        });

        // 날짜 입력: 20241225 → 2024-12-25 자동 변환
        // 시간 입력: 1347 → 13:30 (47분은 30분으로 반올림)
        // 포커스 시 전체 선택으로 빠른 수정 가능
      </script>
    `,
    lang: 'html'
  },

  calendar: {
    title: '캘린더 네비게이션 및 표시',
    description: `
      직관적인 캘린더 인터페이스와 다양한 날짜 상태 표시를 제공합니다.

      - <strong>월 이동</strong>: 이전/다음 버튼으로 월 단위 네비게이션
      - <strong>오늘 날짜</strong>: <code>today</code> 클래스로 강조 표시
      - <strong>선택된 날짜</strong>: <code>selected</code> 클래스로 강조 표시
      - <strong>주말</strong>: <code>weekend</code> 클래스 적용 (토요일, 일요일)
      - <strong>공휴일</strong>: <code>holiday</code> 클래스 적용 (한국 주요 공휴일)
      - <strong>비활성 날짜</strong>: 제약 조건에 해당하지 않는 날짜는 <code>disabled</code> 클래스
    `,
    code: `
      <input id="calendar-input" type="date" />
      <seo-datepicker id="datepicker-calendar" hidden></seo-datepicker>

      <script>
        const input = document.getElementById('calendar-input');
        const datepicker = document.getElementById('datepicker-calendar');

        input.addEventListener('click', () => {
          const rect = input.getBoundingClientRect();
          datepicker.open(rect, input, false); // 날짜만 선택
        });

        datepicker.addEventListener('onChange', (e) => {
          const { date } = e.detail;
          input.value = date;
        });

        // 캘린더에서 다음이 표시됩니다:
        // - 오늘 날짜 (파란색 테두리)
        // - 선택된 날짜 (배경 강조)
        // - 주말 (다른 색상)
        // - 공휴일 (빨간색)
        // - 제약 조건으로 선택 불가한 날짜 (회색)
      </script>
    `,
    lang: 'html'
  },

  timeSelection: {
    title: '세밀한 시간 선택',
    description: `
      30분 단위의 시간 선택과 스크롤 기반 인터페이스를 제공합니다.

      - <strong>30분 단위</strong>: 00:00부터 23:30까지 48개의 시간 옵션
      - <strong>자동 스크롤</strong>: 선택된 시간이 가시 영역 중앙에 오도록 자동 스크롤
      - <strong>클릭 선택</strong>: 시간 목록에서 직접 클릭하여 선택
      - <strong>입력 동기화</strong>: 시간 입력 필드와 선택 목록이 실시간 동기화
      - <strong>포맷팅 연동</strong>: 입력된 시간이 자동으로 30분 단위로 반올림되어 목록에 반영
    `,
    code: `
      <input id="time-input" type="datetime-local" />
      <seo-datepicker id="datepicker-time" hidden></seo-datepicker>

      <script>
        const input = document.getElementById('time-input');
        const datepicker = document.getElementById('datepicker-time');

        input.addEventListener('click', () => {
          const rect = input.getBoundingClientRect();
          datepicker.open(rect, input, true); // 시간 선택 활성화
        });

        datepicker.addEventListener('onChange', (e) => {
          const { date, time } = e.detail;
          input.value = \`\${date}T\${time}\`;
        });

        // 시간 선택 특징:
        // - 30분 간격으로 정확한 시간 선택
        // - 입력 필드에서 실시간 포맷팅 및 목록 동기화
        // - 선택된 시간으로 자동 스크롤 이동
        // - 최대 23:30까지 입력 가능
      </script>
    `,
    lang: 'html'
  },

  modal: {
    title: '모달 위치 및 애니메이션',
    description: `
      트리거 요소 기준으로 정확한 위치에 모달을 표시하고 부드러운 애니메이션을 제공합니다.

      - <strong>동적 위치 계산</strong>: <code>getBoundingClientRect()</code> 기준으로 모달 위치 설정
      - <strong>애니메이션 효과</strong>: <code>enter</code> 클래스를 통한 CSS 트랜지션
      - <strong>외부 클릭 감지</strong>: 모달 영역 외부 클릭 시 자동 닫기
      - <strong>트리거 요소 추적</strong>: 동일한 트리거 요소 클릭 시 애니메이션 최적화
      - <strong>Promise 기반 닫기</strong>: <code>close()</code> 메서드는 애니메이션 완료를 기다리는 Promise 반환
    `,
    code: `
      <div style="display: flex; gap: 20px; flex-wrap: wrap;">
        <input id="modal-1" type="date" style="margin: 10px;" />
        <input id="modal-2" type="datetime-local" style="margin: 50px;" />
        <input id="modal-3" type="date" style="margin: 100px 20px;" />
      </div>

      <seo-datepicker id="datepicker-modal" hidden></seo-datepicker>

      <script>
        const datepicker = document.getElementById('datepicker-modal');

        ['modal-1', 'modal-2', 'modal-3'].forEach(id => {
          const input = document.getElementById(id);

          input.addEventListener('click', () => {
            const rect = input.getBoundingClientRect();
            const showTime = input.type === 'datetime-local';
            datepicker.open(rect, input, showTime);
          });
        });

        datepicker.addEventListener('onChange', (e) => {
          const { date, time, id } = e.detail;
          const input = document.getElementById(id);

          if (input.type === 'datetime-local') {
            input.value = \`\${date}T\${time}\`;
          } else {
            input.value = date;
          }
        });

        // 각 input 위치에 따라 모달이 적절한 위치에 표시됨
        // 외부 클릭하거나 ESC 키로 모달 닫기 가능
        // 부드러운 fade-in/out 애니메이션 적용
      </script>
    `,
    lang: 'html'
  },

  formIntegration: {
    title: '폼 연동 및 formAssociated',
    description: `
      <code>formAssociated = true</code>로 설정되어 표준 HTML 폼과 완전히 호환됩니다.

      - <strong>폼 검증</strong>: required, min, max 등 표준 검증 속성과 연동
      - <strong>폼 데이터</strong>: FormData에 자동으로 포함되어 서버 전송 가능
      - <strong>리셋 지원</strong>: 폼 리셋 시 컴포넌트 상태도 함께 초기화
      - <strong>접근성</strong>: 스크린 리더 및 접근성 도구와 호환
      - <strong>네이티브 동작</strong>: 브라우저의 기본 폼 동작과 일치하는 사용자 경험

      **주의**: 이 컴포넌트는 직접 폼 값을 가지지 않고, 연결된 input 요소를 통해 폼 데이터가 관리됩니다.
    `,
    code: `
      <form id="datetime-form">
        <div class="form-field">
          <label for="event-start">이벤트 시작:</label>
          <input id="event-start" name="startDate" type="datetime-local" required />
        </div>

        <div class="form-field">
          <label for="event-end">이벤트 종료:</label>
          <input id="event-end" name="endDate" type="datetime-local" required />
        </div>

        <div class="form-field">
          <label for="reminder">리마인더 날짜:</label>
          <input id="reminder" name="reminderDate" type="date" />
        </div>

        <button type="submit">이벤트 생성</button>
        <button type="reset">초기화</button>
      </form>

      <seo-datepicker id="datepicker-form" hidden></seo-datepicker>

      <script>
        const form = document.getElementById('datetime-form');
        const datepicker = document.getElementById('datepicker-form');

        // 모든 날짜/시간 입력에 datepicker 연결
        form.querySelectorAll('input[type="date"], input[type="datetime-local"]').forEach(input => {
          input.addEventListener('click', () => {
            const rect = input.getBoundingClientRect();
            const showTime = input.type === 'datetime-local';
            datepicker.open(rect, input, showTime);
          });
        });

        datepicker.addEventListener('onChange', (e) => {
          const { date, time, id } = e.detail;
          const input = document.getElementById(id);

          if (input.type === 'datetime-local') {
            input.value = \`\${date}T\${time}\`;
          } else {
            input.value = date;
          }

          // 폼 검증 트리거
          input.dispatchEvent(new Event('input', { bubbles: true }));
        });

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(form);

          console.log('폼 데이터:');
          for (const [key, value] of formData.entries()) {
            console.log(\`\${key}: \${value}\`);
          }
        });
      </script>
    `,
    lang: 'html'
  }
};