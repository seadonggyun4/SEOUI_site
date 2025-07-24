export const docs = {
  virtualTable: {
    title: '가상 스크롤 테이블',
    description: `
      <strong>가상 스크롤</strong> 기반의 <code>table</code> 컴포넌트로 대량 데이터의 렌더링 성능을 극대화합니다.<br/>
      다음과 같은 기능을 제공합니다:

      - <strong>GridDataTable</strong> 클래스를 사용하여 DOM 기반으로 구성됩니다.
      - 수천 건 이상의 데이터도 <strong>scroll</strong> 이벤트에 따라 필요한 행만 렌더링되므로 퍼포먼스가 매우 우수합니다.
      - 내부에 테이블 태그와 <code>colgroup</code> 태그를 이용해 구조화를 진행하면 됩니다.
      - <strong>행 클릭</strong> 시 <code>onRowClick</code> 이벤트가 발생하며, 해당 행은 <code>active</code> 클래스로 강조됩니다.
      - <strong>셀 클릭</strong> 시 <code>onCellClick</code> 이벤트가 발생합니다.

      <br/>
      <strong>GridDataTable 생성자</strong><br/>
      <code>new GridDataTable(table, data, columns, options)</code> 형식으로 사용하며, 각 인자의 의미는 다음과 같습니다:

      <ul>
        <li><code>table: HTMLTableElement</code> – 렌더링 대상이 되는 테이블 요소입니다. <code>&lt;table&gt;</code> 엘리먼트만 지정하면 되고, <code>&lt;tbody&gt;</code>가 반드시 포함되어 있어야 합니다.</li>
        <li><code>data: any[]</code> – 테이블에 표시할 원본 데이터 배열입니다.</li>
        <li><code>columns: ColumnDef[]</code> – 각 열의 구성 정보입니다. <code>key</code>, <code>type</code>, <code>class</code>, <code>html</code>(선택)을 포함합니다.</li>
      </ul>

      <br/>
      <strong>options 객체</strong><br/>
      선택적으로 네 번째 인자로 넘길 수 있으며, 다음 속성을 지원합니다:

      <ul>
        <li><code>rowHeight: number</code> – 각 행의 높이를 픽셀 단위로 지정합니다. 기본값은 <code>35</code>입니다.</li>
        <li><code>overscan: number</code> – 가상 스크롤 시, 화면 외에 추가로 렌더링할 행 수입니다. 기본값은 <code>10</code>입니다.</li>
        <li><code>cancelStatus: boolean</code> – 특정 비활성 상태 로직을 사용할지 여부를 지정합니다. 기본값은 <code>false</code>입니다.</li>
        <li><code>activeId: string | number | null</code> – 기본 활성화할 행의 고유 ID를 지정할 수 있습니다. 지정 시 해당 ID를 가진 행이 강조됩니다.</li>
        <li><code>onDelete: ((row: any) => void) | null</code> – 외부에서 행 삭제 동작이 필요할 때 사용할 수 있는 콜백입니다. 기본값은 <code>null</code>이며, 전달된 경우 삭제 시 호출됩니다.</li>
      </ul>

      <br/>
      <strong>columns 구성 방식</strong><br/>
      각 열은 <code>{ key, type, class }</code> 형식의 객체로 구성되며,
      <code>key</code>는 데이터의 속성명을 지정하고,
      <code>type</code>은 해당 셀의 렌더링 방식을 결정합니다.<br/>

      <strong>지원하는 type 목록</strong>
      <ul>
        <li><code>number</code>: 숫자를 쉼표 포맷으로 표시하며 0일 경우 <code>empty</code> 클래스를 부여합니다.</li>
        <li><code>string</code>: 일반 문자열로 출력됩니다. <code>key === "idx"</code>일 경우 인덱스 번호를 표시합니다.</li>
        <li><code>date</code>: 날짜를 <code>YYYY-MM-DD</code> 형식으로 표시합니다.</li>
        <li><code>datetime</code>: 날짜와 시간을 <code>YYYY-MM-DD HH:mm</code> 형식으로 표시합니다.</li>
        <li><code>html</code>: 문자열을 HTML로 안전하게 렌더링합니다.</li>
        <li><code>img</code>: 이미지 태그 문자열 등 HTML로 렌더링되며 <code>html</code>과 동일한 처리 방식입니다.</li>
        <li><code>custom</code>: 사용자 정의 렌더링. <code>col.html(td, rowIdx, colIdx, col, rowData)</code> 함수를 통해 DOM 요소를 생성합니다.</li>
      </ul>
    `,
    code: `
      <ag-table id="vtable">
        <colgroup>
        </colgroup>
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>이름</th>
              <th>금액</th>
              <th>날짜</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </ag-table>

      <script type="module">
        import { GridDataTable } from './GridDataTable.js';

        const table = document.querySelector('#vtable table');
        const data = Array.from({ length: 10000 }).map((_, i) => ({
          id: i + 1,
          name: \`고객 \${i + 1}\`,
          amount: Math.floor(Math.random() * 1000000),
          date: new Date(Date.now() - i * 10000000).toISOString(),
        }));

        const columns = [
          { key: 'id', type: 'number', class: ['text-center'] },
          { key: 'name', type: 'string' },
          { key: 'amount', type: 'number', class: ['text-right'] },
          { key: 'date', type: 'date' },
        ];

        const vt = new GridDataTable(table, data, columns, {
          rowHeight: 36,
          overscan: 10,
        });
      </script>
    `,
    lang: 'html',
  },

  cellSelection: {
    title: '다중 셀 선택 및 복사',
    description: `
      <strong>마우스 드래그</strong> 또는 <code>Shift + 방향키</code>를 통해 다중 셀을 선택할 수 있습니다.<br/>
      선택된 셀은 시각적으로 강조되며 다음과 같은 동작이 지원됩니다:

      - <strong>복사</strong>: <code>Ctrl/Cmd + C</code> 입력으로 클립보드에 텍스트 복사
      - <strong>붙여넣기</strong>: <code>Ctrl/Cmd + V</code> 입력으로 셀 범위에 데이터 붙여넣기
      - <strong>HTML 포함</strong>: <code>type: html</code> 또는 <code>img</code> 컬럼은 HTML string 그대로 복사됨
      - <strong>이미지 셀</strong>: <code>&lt;img&gt;</code> 태그 내 <code>src</code> 값만 텍스트로 복사됨
      - <strong>Fill Handler</strong>: 선택된 셀 우측하단에 표시되는 드래그 핸들로 영역 복사 가능
    `,
    code: `
      // 복사 시
      navigator.clipboard.writeText('텍스트 복사됨');

      // 붙여넣기 시
      document.addEventListener('paste', (e) => {
        const text = e.clipboardData.getData('text/plain');
        // 텍스트를 해당 셀 영역에 반영
      });

      // 내부적으로 사용되는 구조
      const selectedRange = {
        start: { row: 2, col: 1 },
        end: { row: 4, col: 3 }
      };
    `,
    lang: 'ts',
  },

  fillHandler: {
    title: 'Fill Handler (자동 복사)',
    description: `
      선택된 셀의 우측 하단에는 <strong>fill-handler</strong>가 표시되며,
      이 핸들을 <strong>아래 또는 오른쪽</strong>으로 드래그하면 선택된 셀의 값이 자동 복사됩니다.

      - 내부적으로 <code>_calculateFillArea()</code>를 통해 복사 대상 범위를 계산합니다.
      - HTML 셀(<code>html</code>, <code>img</code>)은 innerHTML로 복제되고,
        일반 셀은 포맷된 텍스트 값을 그대로 적용합니다.
      - 선택 영역은 드래그 완료 후 자동 확장되며, 복사 시 애니메이션이 적용됩니다.
    `,
    code: `
      // 예: 2행 2열 셀을 오른쪽으로 드래그
      fillStartRange = {
        start: { row: 2, col: 2 },
        end:   { row: 2, col: 2 }
      };

      fillCurrent = { row: 2, col: 4 }; // 오른쪽 끝

      // 적용 결과
      // 2행 3열, 4열도 같은 값으로 채워짐
    `,
    lang: 'ts',
  },

  deleteAndExport: {
    title: '행 삭제 및 엑셀 다운로드',
    description: `
      드래그로 선택된 셀을 기반으로 다음과 같은 작업이 가능합니다:

      - <strong>행 삭제</strong>: 선택된 셀 범위에 포함된 <strong>중복 제거된 행 인덱스</strong>를 기준으로 내부적으로 <code>splice()</code> 처리가 수행되며,
        이후 <code>onRowDelete</code> 커스텀 이벤트를 통해 삭제된 행 목록과 인덱스가 외부로 전달됩니다.

      - <strong>엑셀 내보내기</strong>: 선택 영역 또는 전체 테이블을 내보낼 수 있으며, 이 동작은 <strong>내부에서 직접 처리하지 않고</strong>
        다음의 커스텀 이벤트를 외부로 디스패치하여, 외부에서 다운로드 로직을 실행하도록 합니다:

        - <code>exportSelected</code>: 선택된 셀 범위를 내보내기
        - <code>exportAll</code>: 전체 데이터를 내보내기

      엑셀 데이터에는 <strong>컬럼 헤더</strong>, <strong>포맷팅된 텍스트</strong>, <strong>HTML 파싱 결과</strong> 등이 포함되며,
      외부에서 <code>ExcelJS</code> 또는 다른 라이브러리를 사용해 처리할 수 있습니다.
    `,
    code: `
      // 삭제 시
      vt.rowDelete();

      // → 내부적으로 삭제 처리 후 아래와 같은 이벤트 발생
      table.addEventListener('onRowDelete', (e) => {
        const { rowIndexes, rows } = e.detail;
        console.log('삭제된 행 정보:', rowIndexes, rows);
      });

      // 선택 영역 엑셀 내보내기
      vt._exportExcel();

      // → 아래와 같은 이벤트 발생
      table.addEventListener('exportSelected', (e) => {
        const { header, body, columns } = e.detail;
        // ExcelJS 등으로 처리
      });

      // 전체 엑셀 내보내기
      vt._exportAllExcel();

      // → 아래와 같은 이벤트 발생
      table.addEventListener('exportAll', (e) => {
        const { header, body, columns } = e.detail;
        // 전체 테이블 저장 처리
      });
    `,
    lang: 'ts',
  }
};
