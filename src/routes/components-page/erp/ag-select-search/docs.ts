export const docs = {
  selectSearch: {
    title: '검색 셀렉트박스',
    description: `
      \`ag-select-search\` 컴포넌트는 초성 검색 기능을 포함한 셀렉트 박스입니다.

      - 기본 \`ag-select\` 기능을 모두 포함하며, 입력 필드를 통해 옵션을 실시간 검색할 수 있습니다.
      - 초성 검색은 \`ㄱ\`부터 \`ㅎ\`까지 한글 자음 검색에 대응하며, 유틸 함수 <code>getChosungAll</code>을 내부적으로 사용합니다.
      - 가상 렌더링을 통해 수천 개의 항목을 빠르게 처리할 수 있습니다.
      - 옵션 선택 시 <strong>select 이벤트가 발생</strong>하고, 해당 이벤트를 통해 <code>value</code>와 <code>label</code>을 확인할 수 있습니다.
    `,
    code: `
      <form preventdefault:submit onSubmit$={(ev) => {
        const form = ev.target as HTMLFormElement;
        const selectEl = form.querySelector('ag-select-search') as any;
        alert(\`선택된 값: \${selectEl.value}\`);
      }}>
        <ag-select-search id="search-select" name="search"></ag-select-search>
        <button type="submit">제출</button>
      </form>

      // 초기화 예시 (optionItems 주입)
      const el = document.getElementById('search-select');
      el.optionItems = Array.from({ length: 1000 }).map((_, i) => ({
        value: \`option-\${i}\`,
        label: \`옵션 \${i}\`,
      }));
    `,
  },
};