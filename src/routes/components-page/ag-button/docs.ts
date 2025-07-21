export const docs = {
  size: {
    title: '버튼 사이즈',
    description: `
      <strong>size</strong> 속성을 사용하여 버튼의 크기를 설정할 수 있습니다.

      - 지원 값: <code>small</code>, <code>large</code>
      - 미지정 시 기본값: <code>medium</code>
    `,
    code: `
      <ag-button size="large">확인</ag-button>
      <ag-button>확인</ag-button>
      <ag-button size="small">확인</ag-button>
    `,
    lang: 'html'
  },

  variant: {
    title: '버튼 색상',
    description: `
      <strong>variant</strong> 속성으로 버튼의 테마 색상을 지정할 수 있습니다.

      - 지원 값: <code>primary</code>, <code>error</code>, <code>warning</code>, <code>success</code>, <code>white</code>
    `,
    code: `
      <ag-button variant="primary">확인</ag-button>
      <ag-button variant="error">확인</ag-button>
      <ag-button variant="warning">확인</ag-button>
      <ag-button variant="success">확인</ag-button>
      <ag-button variant="white">확인</ag-button>
    `,
    lang: 'html'
  },

  disabled: {
    title: '활성화 / 비활성화',
    description: `
      <strong>disabled</strong> 속성을 부여하면 버튼이 비활성화됩니다.

      - 클릭이 불가능해지고
      - 시각적으로도 흐릿한 상태로 표시됩니다.
    `,
    code: `
      <ag-button>활성화</ag-button>
      <ag-button disabled>비활성화</ag-button>
    `,
    lang: 'html'
  },

  loading: {
    title: '로딩 상태',
    description: `
      버튼 요소에 <strong>promise</strong> 속성을 주입하면 로딩 상태가 자동으로 처리됩니다.

      - 내부적으로 <code>Spinner</code>가 표시되며
      - 텍스트는 자동으로 숨겨집니다.
    `,
    code: `
      const btn = document.querySelector('[name="large-loading"]');
      btn.promise = new Promise(resolve => setTimeout(resolve, 2000));
    `,
  },

  submit: {
    title: 'Form 내부 버튼',
    description: `
      <code>ag-button</code>을 <code>form</code> 내에서 <strong>type="submit"</strong>으로 사용하면 <strong>submit</strong> 이벤트가 발생합니다.

      - 이때 버튼에 <strong>promise</strong>를 주입하면 로딩 상태도 자동으로 처리됩니다.
    `,
    code: `
      <form onSubmit$={formSubmit}>
        <ag-button type="submit">테스트</ag-button>
      </form>
    `,
    lang: 'html'
  },
};
