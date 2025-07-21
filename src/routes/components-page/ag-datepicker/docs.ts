export const docs = {
  basic: {
    title: '기본 날짜/시간 선택기',
    description: `
      <code>ag-datepicker</code>는 날짜 또는 날짜+시간 입력을 위한 커스텀 캘린더 컴포넌트입니다.

      - 일반 <code>&lt;input type="date"&gt;</code>, <code>datetime-local</code> 태그와 유사한 UI를 제공하지만, 클릭 시 <strong>커스텀 달력 모달</strong>이 표시됩니다.
      - 입력창을 클릭하면 <code>openDatePicker</code> 유틸 함수를 통해 날짜 선택기를 실행할 수 있습니다.
      - 사용자가 날짜/시간을 선택하면 <code>onChange</code> 이벤트가 발생하고, <strong>선택된 값이 원래 input에 반영</strong>됩니다.
    `,
    code: `
      <input id="date" type="date" />
      <input id="datetime-local" type="datetime-local" />
      <input id="datetime" type="datetime" />

      <script>
        const dp = document.getElementById('ag-datepicker-main');

        const input = document.getElementById('date');
        input.addEventListener('click', () => {
          const rect = input.getBoundingClientRect();
          dp.open(rect, input);
        });

        dp.addEventListener('onChange', (e) => {
          const { date } = e.detail;
          input.value = date;
        });
      </script>
    `,
    lang: 'html'
  },
  range: {
    title: '범위 선택 (시작일/종료일)',
    description: `
      <strong>시작일 입력 후 자동으로 종료일로 이동</strong>하는 날짜 범위 선택 기능입니다.

      - <code>criteriaDate</code> 속성은 기준일을 설정하여 종료일 달력에 표시됩니다.
      - 시작일 선택 시 종료일 input으로 포커스가 이동하며, <code>openDatePicker</code> 유틸에서 <strong>startTargetId / endTargetId</strong>를 함께 전달해야 동작합니다.
      - <code>onChange</code> 이벤트에서 <code>e.detail.id</code>를 활용해 어느 input에서 발생한 것인지 구분해야 합니다.
    `,
    code: `
      <input id="start-local" type="datetime-local" />
      ~
      <input id="end-local" type="datetime-local" />

      <script>
        const dp = document.getElementById('ag-datepicker-main');

        const $start = document.getElementById('start-local');
        const $end = document.getElementById('end-local');

        $start.addEventListener('click', () => {
          dp.open($start.getBoundingClientRect(), $start);
        });

        dp.addEventListener('onChange', (e) => {
          const { id, date, time } = e.detail;

          if (id === 'start-local') {
            $start.value = \`\${date}T\${time}\`;
            $end.value = \`\${date}T\${time}\`;
            dp.criteriaDate = date;
            dp.open($end.getBoundingClientRect(), $end);
          } else if (id === 'end-local') {
            $end.value = \`\${date}T\${time}\`;
          }
        });
      </script>
    `,
    lang: 'html'
  },
  keydown: {
    title: '키보드 입력 처리',
    description: `
      <code>ag-datepicker</code>는 내부적으로 <strong>keydown 이벤트를 감지하여 다음 동작을 수행</strong>합니다.

      - <strong>Enter</strong>: 유효한 날짜와 시간이 입력된 경우 <code>onChange</code> 이벤트를 발생시키고, 모달을 닫습니다.
      - <strong>Escape</strong>: 현재 열린 모달을 닫습니다.
      - <strong>Tab</strong>: 시간 입력 영역 또는 버튼으로 focus 이동(기본 브라우저 동작 유지)
      - 포커스된 input에서 <strong>자동 전체 선택</strong> 기능이 적용되어 빠르게 수정할 수 있습니다.

      이 키보드 이벤트는 사용자 정의 없이도 자동으로 작동하며, <code>open()</code>으로 datepicker를 열어준 상태라면 <strong>전역적인 키보드 인터랙션이 가능합니다.</strong>
    `,
    code: `
      <input id="keyboard-input" type="datetime-local" />

      <script>
        const dp = document.getElementById('ag-datepicker-main');
        const $input = document.getElementById('keyboard-input');

        $input.addEventListener('click', () => {
          dp.open($input.getBoundingClientRect(), $input);
        });

        dp.addEventListener('onChange', (e) => {
          const { date, time } = e.detail;
          $input.value = \`\${date}T\${time}\`;
        });

        // 사용자가 Enter를 누르면 자동으로 값이 적용되고, ESC로 닫을 수 있습니다.
      </script>
    `,
    lang: 'html'
  }
};
