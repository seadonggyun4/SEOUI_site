export const docs = {
  window: {
    title: '윈도우 프레임',
    description: `
      <code>ag-window</code> 컴포넌트는 윈도우 스타일의 프레임 레이아웃을 제공합니다.

      - 상단에 닫기/최소화/최대화 버튼이 포함된 헤더 영역이 있으며
      - 탭 구조와 좌측 아이콘 메뉴, 검색창 구조가 기본으로 포함됩니다.
      - 내부 콘텐츠는 <strong>기본 slot</strong>을 통해 렌더링됩니다,

      이 컴포넌트는 주로 <strong>탭 기반 에디터 UI</strong>나 <strong>파일 관리 인터페이스</strong>처럼 시각적 영역 구분이 필요한 경우에 적합합니다.
    `,
    code: `
      <ag-window>
        <p>여기에 표시될 콘텐츠입니다.</p>
        <form onsubmit="alert('제출됨')">
          <input type="text" placeholder="입력" />
          <button type="submit">제출</button>
        </form>
      </ag-window>
    `,
  },
};
