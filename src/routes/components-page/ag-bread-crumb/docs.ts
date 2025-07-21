export const docs = {
  breadcrumb: {
    title: '브레드크럼 (Breadcrumb)',
    description: `
      \`ag-breadcrumb\` 컴포넌트는 페이지의 경로 구조를 시각적으로 표현해주는 네비게이션 컴포넌트입니다.

      - <strong>items</strong>: { label, path } 형태의 객체 배열
      - <strong>currentUrl</strong>: 현재 페이지의 경로
      - <strong>root</strong>: 홈으로 이동할 기본 경로

      예시: \`[{ label: "홈", path: "/" }, { label: "상품", path: "/product" }]\`
    `,
    code: `
      <ag-breadcrumb
        .items='[{ "label": "서비스", "path": "/service" }, { "label": "신청", "path": "/service/apply" }]'
        root="/"
        currentUrl="/service/apply"
      ></ag-breadcrumb>
    `,
    lang: 'html'
  },
};
