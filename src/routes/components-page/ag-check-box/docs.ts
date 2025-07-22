export const docs = {
  checkboxState: {
    title: '체크박스 체크/활성화 상태',
    description: `
      <code>ag-check-box</code>는 기본적으로 선택되지 않은 상태이며,
      <strong>checked</strong> 속성을 부여하면 선택된 상태로 표시됩니다.
      <strong>disabled</strong> 속성을 추가하면 비활성화되어 선택 불가능한 상태로 렌더링됩니다.
    `,
    code: `
      <ag-check-box></ag-check-box>
      <ag-check-box checked></ag-check-box>
      <ag-check-box checked disabled></ag-check-box>
    `,
    lang: 'html'
  },

  checkboxLabel: {
    title: '체크박스 라벨',
    description: `
      <strong>label</strong> 속성을 사용하여 체크박스 우측에 설명 텍스트를 표시할 수 있습니다.
    `,
    code: `
      <ag-check-box checked label="슈퍼면책 적용"></ag-check-box>
    `,
    lang: 'html'
  },

  toggleState: {
    title: '토글 체크/활성화 상태',
    description: `
      <code>ag-toggle</code>은 스위치 형태의 컴포넌트로,
      <strong>checked</strong> 속성을 통해 켜진 상태를 지정할 수 있고,
      <strong>disabled</strong> 속성을 통해 사용자 입력을 비활성화할 수 있습니다.
    `,
    code: `
      <ag-toggle></ag-toggle>
      <ag-toggle checked></ag-toggle>
      <ag-toggle checked disabled></ag-toggle>
    `,
    lang: 'html'
  },

  toggleLabel: {
    title: '토글 라벨',
    description: `
      <strong>label</strong> 속성을 지정하면 토글 오른쪽에 텍스트가 표시됩니다.
    `,
    code: `
      <ag-toggle label="취소 제외" checked></ag-toggle>
    `,
    lang: 'html'
  },

  radioState: {
    title: '라디오 체크/활성화 상태',
    description: `
      <code>ag-radio</code>는 선택지 배열을 <strong>options</strong> 속성으로 전달하여 사용합니다.
      각 선택지에는 <strong>label</strong>, <strong>value</strong>를 포함해야 하며,
      <strong>value</strong> 속성을 통해 현재 선택된 값을 설정할 수 있습니다.
      <strong>disabled</strong> 속성을 통해 라디오 그룹 전체를 비활성화할 수 있습니다.
    `,
    code: `
      const radio = document.querySelector('ag-radio');
      radio.options = [
        { label: '옵션 A', value: 'a' },
        { label: '옵션 B', value: 'b' },
        { label: '옵션 C', value: 'c' },
      ];
      radio.value = 'a';
    `,
  },

  submit: {
    title: 'Form 내부 체크박스 / 토글 / 라디오 버튼',
    description: `
      \`ag-check-box\`, \`ag-toggle\`, \`ag-radio\`는 모두 <strong>formAssociated</strong>가 true로 설정된 컴포넌트이며,
      <code>&lt;form&gt;</code> 내부에서 <strong>name</strong>과 함께 사용하면 실제 폼 데이터로 정상 제출됩니다.
      <code>button</code>을 <code>type="submit"</code>으로 설정하면 submit 이벤트를 트리거할 수 있습니다.

      체크박스와 토글은 <strong>checked</strong> 상태일 때만 값이 전송되며,
      라디오는 <strong>value</strong>가 선택된 항목의 값으로 제출됩니다.
    `,
    code: `
      <form>
        <ag-check-box name="agree" label="이용 약관 동의" checked></ag-check-box>
        <ag-toggle name="notify" label="알림 수신 동의"></ag-toggle>
        <ag-radio name="plan"></ag-radio>
        <button type="submit">제출</button>
      </form>

      <script>
        const radio = document.querySelector('ag-radio');
        radio.options = [
          { label: '베이직', value: 'basic' },
          { label: '프리미엄', value: 'premium' },
        ];
        radio.value = 'basic';
      </script>
    `,
    lang: 'html'
  },
};
