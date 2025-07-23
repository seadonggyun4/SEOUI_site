export const docs = {
  virtual: {
    title: '가상 스크롤 기반 셀렉트',
    description: `
      <code>ag-select</code> 컴포넌트는 옵션 개수가 많아도 성능 저하 없이 렌더링할 수 있도록
      <strong>가상 스크롤</strong> 방식으로 옵션을 표시합니다.

      - 내부적으로 <code>InteractiveVirtualSelect</code> 유틸을 사용해 가상 렌더링 풀을 구성하며
      - 옵션은 두 가지 방식으로 지정할 수 있습니다:
        1. <strong>&lt;option&gt;</strong> 태그를 자식으로 직접 선언하는 방법 (slot 방식)
        2. <strong>optionItems</strong> 속성으로 배열을 전달하는 방법
      - 컴포넌트는 <strong>slot 방식의 &lt;option&gt;이 우선</strong>이며, slot이 없을 경우에만 <strong>optionItems 배열</strong>을 사용합니다.
      - slot으로 전달된 <code>&lt;option&gt;</code> 태그는 초기화 시점에 내부적으로 제거되며, 렌더링 최적화를 위해 별도의 구조로 변환됩니다.
      - 표시되는 DOM 요소는 실제로 보여지는 옵션 수에 맞춰 제한되며, 빠르게 스크롤이 가능합니다.
    `,
    code: `
      <!-- slot 기반 방식 (우선 적용됨) -->
      <ag-select id="brand" name="brand" width="240px">
        <option value="kia" selected>기아자동차</option>
        <option value="hyundai">현대자동차</option>
        <option value="bmw">BMW</option>
        <option value="benz">Mercedes-Benz</option>
        <option value="tesla">TESLA</option>
        <option value="audi">Audi</option>
        <option value="volvo">Volvo</option>
        <option value="porsche">Porsche</option>
        <option value="chevy">쉐보레</option>
        <option value="jeep">Jeep</option>
        <option value="toyota">Toyota</option>
        <option value="lexus">Lexus</option>
        <option value="peugeot">Peugeot</option>
      </ag-select>

      <!-- 배열 기반 방식 (slot이 없는 경우 fallback으로 사용됨) -->
      <ag-select id="brand-fallback" name="brand-fallback" width="240px"
        .optionItems=\${[
          { value: 'kia', label: '기아자동차' },
          { value: 'hyundai', label: '현대자동차' },
          { value: 'bmw', label: 'BMW' },
          { value: 'benz', label: 'Mercedes-Benz' },
          { value: 'tesla', label: 'TESLA' },
          { value: 'audi', label: 'Audi' },
          { value: 'volvo', label: 'Volvo' },
          { value: 'porsche', label: 'Porsche' },
          { value: 'chevy', label: '쉐보레' },
          { value: 'jeep', label: 'Jeep' },
          { value: 'toyota', label: 'Toyota' },
          { value: 'lexus', label: 'Lexus' },
          { value: 'peugeot', label: 'Peugeot' }
        ]}
      ></ag-select>
    `,
    lang: 'html'
  },

  keyboard: {
    title: '키보드 이벤트 처리',
    description: `
      <code>ag-select</code>는 <strong>키보드 네비게이션</strong>을 완벽히 지원합니다.

      - 셀렉트가 열린 상태에서 키보드 입력을 처리하며, <strong>아래 방향키(↓)</strong> 또는 <strong>Tab</strong> 키로 다음 항목으로 이동합니다.
      - <strong>위 방향키(↑)</strong>로 이전 항목으로 이동할 수 있으며,
      - <strong>Enter</strong> 키를 누르면 현재 포커싱된 항목이 선택됩니다.
      - <strong>ESC</strong> 키를 누르면 드롭다운이 닫힙니다.

      내부적으로 <code>InteractiveVirtualSelect</code> 유틸이 해당 키보드 이벤트를 처리하고 있으며,
      포커스 인덱스를 기준으로 <strong>가시 영역 스크롤</strong> 및 <strong>active/highlight 상태</strong>를 제어합니다.
    `,
    code: `
      <ag-select id="location" name="location" width="200px">
        <option value="seoul" selected>서울</option>
        <option value="busan">부산</option>
        <option value="incheon">인천</option>
        <option value="daegu">대구</option>
        <option value="daejeon">대전</option>
        <option value="ulsan">울산</option>
        <option value="jeju">제주</option>
      </ag-select>
    `,
    lang: 'html'
  },

  behavior: {
    title: '옵션 처리 및 이벤트 동작',
    description: `
      <code>ag-select</code>는 선택 옵션의 렌더링 외에도 다음과 같은 방식으로 데이터를 처리하고,
      선택 이벤트를 외부에 알립니다.

      - 선택 시 자동으로 드롭다운이 닫히고, 내부 <code>value</code> 및 <code>label</code>이 반영됩니다.
      - 선택이 발생하면 <strong>select</strong> 커스텀 이벤트</strong>가 발생하며,
        <code>{ value, label }</code> 형태의 정보를 외부로 전달합니다.
      - <code>select</code> 이벤트는 외부 데이터 바인딩이나 UI 반응 처리를 위해 사용되며,
        <code>change</code> 이벤트와는 독립적으로 동작합니다.
    `,
    code: `
      const selectEl = document.querySelector('ag-select');

      selectEl.addEventListener('select', (e) => {
        const { value, label } = e.detail;
        console.log('선택된 값:', value, label);
      });
    `
  }
};
