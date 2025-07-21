export const docs = {
  tab: {
    title: '탭 리스트',
    description: `
      <code>ag-tab</code> 컴포넌트는 탭 항목 목록을 렌더링하는 컴포넌트입니다.

      - <strong>tabs</strong> 속성에 탭 객체 배열을 주입하여 각 항목을 생성할 수 있으며
      - <strong>selected</strong> 속성으로 현재 활성화된 항목을 지정할 수 있습니다.
      - 탭 클릭 시 <strong>onClick</strong> 커스텀 이벤트가 발생하며, <code>detail.value</code>에 선택된 값이 포함됩니다.
    `,
    code: `
      <ag-tab
        .tabs={[
          { label: '탭 1', value: 'tab1' },
          { label: '탭 2', value: 'tab2' },
          { label: '탭 3', value: 'tab3' },
        ]}
        selected="tab1"
      ></ag-tab>
    `,
    lang: 'html'
  },
};
