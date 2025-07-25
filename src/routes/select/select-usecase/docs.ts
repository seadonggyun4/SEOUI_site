export const docs = {
  basic: {
    title: '기본 셀렉트 사용법',
    description: `
      <code>seo-select</code>는 두 가지 방법으로 옵션을 정의할 수 있습니다:

      1. **slot 방식**: <code>&lt;option&gt;</code> 태그를 직접 자식으로 선언 (우선 적용)
      2. **배열 방식**: <strong>optionItems</strong> 속성으로 배열 전달 (slot이 없을 때 fallback)

      slot으로 전달된 <code>&lt;option&gt;</code>은 초기화 시점에 내부적으로 제거되어
      가상 스크롤 최적화를 위한 별도 구조로 변환됩니다.
      <strong>selected</strong> 속성이 있는 옵션이 초기 선택값으로 설정되며,
      없다면 첫 번째 옵션이 기본값이 됩니다.
    `,
    code: `
      <!-- slot 방식 (권장) -->
      <seo-select name="brand" width="200px">
        <option value="kia">기아자동차</option>
        <option value="hyundai" selected>현대자동차</option>
        <option value="bmw">BMW</option>
        <option value="benz">Mercedes-Benz</option>
      </seo-select>

      <!-- 배열 방식 (fallback) -->
      <seo-select name="brand-alt" width="200px"></seo-select>

      <script>
        const select = document.querySelector('seo-select[name="brand-alt"]');
        select.optionItems = [
          { value: 'kia', label: '기아자동차' },
          { value: 'hyundai', label: '현대자동차' },
          { value: 'bmw', label: 'BMW' },
          { value: 'benz', label: 'Mercedes-Benz' }
        ];
        select.value = 'hyundai'; // 초기값 설정
      </script>
    `,
    lang: 'html'
  },

  theme: {
    title: '테마 시스템',
    description: `
      <code>seo-select</code>와 <code>seo-select-search</code>는 두 가지 테마를 지원합니다:

      - <strong>basic</strong>: 기본적인 직각 모서리 스타일 (테두리 반경 없음)
      - <strong>float</strong>: 둥근 모서리와 그림자 효과가 있는 플로팅 스타일 (기본값)

      <strong>float 테마</strong>의 특징:
      - 5px border-radius로 둥근 모서리
      - 부드러운 드롭 섀도우 효과
      - 드롭다운이 더 떨어진 위치(3.5rem)에서 나타남
      - 위에서 아래로 슬라이드되는 애니메이션 효과 (0.2초)
      - 검색 입력 필드도 상단 모서리가 둥글게 처리됨

      <strong>basic 테마</strong>의 특징:
      - 직각 모서리 (border-radius: 0)
      - 그림자 효과 없음
      - 즉시 나타나는 드롭다운 (애니메이션 없음)
      - 전통적인 select 박스 스타일

      **참고**: 검색 기능이 있는 컴포넌트에서 float 테마 사용 시,
      검색 입력에 포커스하면 그라데이션 글로우 효과가 나타납니다.
    `,
    code: `
      <!-- Float 테마 (기본값) - 둥근 모서리와 애니메이션 -->
      <seo-select name="float-single" theme="float" width="200px">
        <option value="option1">플로팅 옵션 1</option>
        <option value="option2">플로팅 옵션 2</option>
        <option value="option3">플로팅 옵션 3</option>
      </seo-select>

      <!-- Basic 테마 - 직각 모서리와 즉시 표시 -->
      <seo-select name="basic-single" theme="basic" width="200px">
        <option value="option1">베이직 옵션 1</option>
        <option value="option2">베이직 옵션 2</option>
        <option value="option3">베이직 옵션 3</option>
      </seo-select>

      <script>
        // 다중 선택 초기값 설정
        document.querySelector('[name="float-multi"]').selectedValues = ['react', 'vue'];

        // 드롭다운을 열어보시면 테마별 차이를 확인할 수 있습니다
        console.log('테마 데모 준비 완료');
      </script>
    `,
    lang: 'html'
  },

  darkmode: {
    title: '다크 모드 지원',
    description: `
      <code>seo-select</code>와 <code>seo-select-search</code>는 <strong>dark</strong> 속성으로
      다크 모드를 지원합니다.

      <strong>다크 모드 특징</strong>:
      - 어두운 배경색과 밝은 텍스트 색상으로 변경
      - 모든 UI 요소(드롭다운, 태그, 버튼, 검색창)가 다크 테마로 적용
      - 호버 및 포커스 상태도 다크 모드에 맞게 조정
      - Float 테마에서는 다크 모드 전용 그림자 효과 적용
      - 기본값은 <code>false</code> (라이트 모드)

      <strong>다크 모드 색상 시스템</strong>:
      - 배경: 진한 회색 계열 (#2d3748, #1a202c)
      - 텍스트: 밝은 회색 (#e2e8f0, #a0aec0)
      - 테두리: 중간 회색 (#4a5568)
      - 액센트: 파란색 계열 (#63b3ed, #2b6cb0)
      - 에러: 빨간색 (#e53e3e)

      **참고**: 다크 모드는 시스템 테마와 독립적으로 동작하며,
      JavaScript로 동적으로 변경할 수 있습니다.
    `,
    code: `
      <!-- 라이트 모드 (기본값) -->
      <seo-select name="light-mode" theme="float" width="200px">
        <option value="option1">라이트 모드 옵션 1</option>
        <option value="option2">라이트 모드 옵션 2</option>
        <option value="option3">라이트 모드 옵션 3</option>
      </seo-select>

      <!-- 다크 모드 -->
      <seo-select name="dark-mode" theme="float" dark width="200px">
        <option value="option1">다크 모드 옵션 1</option>
        <option value="option2">다크 모드 옵션 2</option>
        <option value="option3">다크 모드 옵션 3</option>
      </seo-select>

      <!-- 다중 선택 다크 모드 -->
      <seo-select multiple name="dark-multi" theme="float" dark width="300px">
        <option value="js">JavaScript</option>
        <option value="ts">TypeScript</option>
        <option value="react">React</option>
        <option value="vue">Vue.js</option>
        <option value="node">Node.js</option>
      </seo-select>

      <!-- 검색 기능이 있는 다크 모드 -->
      <seo-select-search name="dark-search" theme="float" dark width="250px">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cherry">Cherry</option>
        <option value="date">Date</option>
        <option value="elderberry">Elderberry</option>
      </seo-select-search>

      <script>
        // JavaScript로 다크 모드 동적 변경
        const lightSelect = document.querySelector('[name="light-mode"]');
        const darkSelect = document.querySelector('[name="dark-mode"]');

        // 다크 모드 토글 예시
        function toggleDarkMode() {
          lightSelect.dark = !lightSelect.dark;
          console.log('다크 모드:', lightSelect.dark ? '활성화' : '비활성화');
        }

        // 초기 선택값 설정
        document.querySelector('[name="dark-multi"]').selectedValues = ['js', 'react'];

        // 5초 후 라이트 모드 셀렉트를 다크 모드로 변경
        setTimeout(() => {
          toggleDarkMode();
        }, 5000);
      </script>
    `,
    lang: 'html'
  },

  loading: {
    title: '로딩 상태 및 비동기 처리',
    description: `
      <code>seo-select</code>는 옵션이 없을 때 무조건 스피너와 로딩 텍스트를 표시합니다.

      - 옵션이 비어있는 상태에서 드롭다운을 열면 자동으로 로딩 상태가 됩니다
      - slot 또는 <strong>optionItems</strong>를 통해 옵션이 생성되면 즉시 로딩 상태가 해제됩니다
      - 로딩 중에는 애니메이션 도트와 "옵션 로딩 중..." 메시지가 표시됩니다
      - 비동기 데이터 로딩이 완료되면 자동으로 가상 스크롤이 초기화됩니다
      - 옵션이 있는 셀렉트는 로딩 상태가 표시되지 않습니다
    `,
    code: `
      <!-- 옵션이 없는 빈 셀렉트 - 드롭다운 열면 로딩 상태 표시됨 -->
      <seo-select name="loading-demo" width="250px">
        <!-- 비어있는 상태에서 로딩이 시작됨 -->
      </seo-select>

      <!-- 옵션이 있는 셀렉트 - 로딩 상태 표시 안됨 -->
      <seo-select name="normal-select" width="250px">
        <option value="option1">옵션 1</option>
        <option value="option2">옵션 2</option>
      </seo-select>

      <script>
        const loadingSelect = document.querySelector('seo-select[name="loading-demo"]');

        // 실제 사용 시에는 API 호출 등으로 옵션을 동적 로딩
        setTimeout(() => {
          loadingSelect.optionItems = [
            { value: 'loading1', label: '로딩된 옵션 1' },
            { value: 'loading2', label: '로딩된 옵션 2' },
            { value: 'loading3', label: '로딩된 옵션 3' }
          ];
          // 옵션이 설정되면 즉시 로딩 상태 해제됨
        }, 2000);
      </script>
    `,
    lang: 'html'
  },

  virtual: {
    title: '가상 스크롤링과 대용량 데이터',
    description: `
      <code>seo-select</code>는 <strong>InteractiveVirtualSelect</strong> 유틸을 사용해
      수천 개의 옵션도 성능 저하 없이 처리할 수 있습니다.

      - 실제 DOM에는 가시 영역의 옵션만 렌더링되어 메모리 효율적입니다
      - 스크롤 시 동적으로 옵션들이 재사용되며 렌더링 풀을 통해 최적화됩니다
      - 키보드 네비게이션 시에도 가상 스크롤이 자동으로 동기화됩니다
      - <strong>width</strong> 속성을 지정하지 않으면 옵션 텍스트 길이를 측정해 자동 조절됩니다
    `,
    code: `
      <seo-select id="large-dataset" name="item" width="300px"></seo-select>

      <script>
        const select = document.getElementById('large-dataset');

        // 10,000개 옵션 생성
        select.optionItems = Array.from({ length: 10000 }, (_, i) => ({
          value: \`item-\${i.toString().padStart(4, '0')}\`,
          label: \`아이템 \${i.toString().padStart(4, '0')} - 긴 텍스트 설명\`
        }));

        // 성능에 영향 없이 즉시 렌더링됨
        console.log('대용량 데이터 로드 완료');
      </script>
    `,
    lang: 'html'
  },

  keyboard: {
    title: '키보드 네비게이션',
    description: `
      <code>seo-select</code>는 완전한 키보드 접근성을 제공합니다:

      - <strong>Tab</strong>: 셀렉트 포커스 이동
      - <strong>↓ (아래 화살표)</strong>: 다음 옵션으로 이동
      - <strong>↑ (위 화살표)</strong>: 이전 옵션으로 이동
      - <strong>Enter</strong>: 현재 포커싱된 옵션 선택
      - <strong>ESC</strong>: 드롭다운 닫기

      포커스된 옵션은 자동으로 가시 영역으로 스크롤되며,
      <strong>InteractiveVirtualSelect</strong>가 키보드 이벤트를 처리합니다.
    `,
    code: `
      <seo-select name="navigation-test" width="250px">
        <option value="option1">옵션 1</option>
        <option value="option2">옵션 2</option>
        <option value="option3">옵션 3</option>
        <option value="option4">옵션 4</option>
        <option value="option5">옵션 5</option>
        <option value="option6">옵션 6</option>
        <option value="option7">옵션 7</option>
        <option value="option8">옵션 8</option>
        <option value="option9">옵션 9</option>
        <option value="option10">옵션 10</option>
      </seo-select>

      <!-- Tab으로 포커스 이동 후 키보드로 조작 가능 -->
    `,
    lang: 'html'
  },

  events: {
    title: '이벤트 처리',
    description: `
      <code>seo-select</code>는 다음과 같은 커스텀 이벤트를 발생시킵니다:

      - <strong>onSelect</strong>: 옵션 선택 시 발생 (<code>{ value, label }</code> 전달)
      - <strong>onDeselect</strong>: 다중 선택에서 태그 제거 시 발생 (다중 모드만)
      - <strong>onReset</strong>: 리셋 버튼 클릭 시 발생
      - <strong>change</strong>: 표준 change 이벤트 (폼 연동용)

      이벤트는 <code>bubbles: true, composed: true</code>로 설정되어
      상위 요소에서도 캐치할 수 있습니다.

      **참고**: 아래 예시의 셀렉트를 조작하면 브라우저 콘솔에서 이벤트 로그를 확인할 수 있습니다.
    `,
    code: `
      <seo-select id="event-demo" name="demo" width="200px">
        <option value="a">옵션 A</option>
        <option value="b">옵션 B</option>
        <option value="c">옵션 C</option>
      </seo-select>

      <script>
        const select = document.getElementById('event-demo');

        select.addEventListener('onSelect', (e) => {
          const { value, label } = e.detail;
          console.log('선택됨:', value, label);
        });

        select.addEventListener('onReset', (e) => {
          console.log('리셋됨:', e.detail);
        });

        select.addEventListener('change', (e) => {
          console.log('폼 값 변경:', e.target.value);
        });
      </script>
    `,
    lang: 'html'
  },

  multiple: {
    title: '다중 선택 모드',
    description: `
      <strong>multiple</strong> 속성을 추가하면 여러 옵션을 동시에 선택할 수 있습니다.

      - 선택된 값들은 태그 형태로 표시되며, 각 태그에 삭제 버튼이 있습니다
      - <strong>selectedValues</strong> 배열로 선택된 값들에 접근할 수 있습니다
      - <strong>value</strong> 속성은 쉼표로 구분된 문자열을 반환합니다 (폼 전송용)
      - 이미 선택된 옵션은 드롭다운에서 제외되어 표시됩니다
      - 태그 제거 시 해당 옵션이 다시 드롭다운에 나타납니다

      **참고**: 태그를 클릭하여 제거하거나 드롭다운에서 추가 선택하면
      <code>onSelect</code>, <code>onDeselect</code> 이벤트가 발생합니다.
    `,
    code: `
      <seo-select multiple name="skills" width="400px">
        <option value="js">JavaScript</option>
        <option value="ts">TypeScript</option>
        <option value="react">React</option>
        <option value="vue">Vue.js</option>
        <option value="angular">Angular</option>
        <option value="svelte">Svelte</option>
        <option value="node">Node.js</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="go">Go</option>
      </seo-select>

      <script>
        const multiSelect = document.querySelector('seo-select[multiple]');

        // 초기 선택값 설정
        multiSelect.selectedValues = ['js', 'ts', 'react'];

        multiSelect.addEventListener('onSelect', (e) => {
          console.log('추가 선택:', e.detail);
          console.log('현재 모든 선택값:', multiSelect.selectedValues);
        });

        multiSelect.addEventListener('onDeselect', (e) => {
          console.log('선택 해제:', e.detail);
        });
      </script>
    `,
    lang: 'html'
  },

  reset: {
    title: '리셋 기능',
    description: `
      <strong>showReset</strong> 속성(기본값: true)에 따라 리셋 버튼이 표시됩니다.

      **단일 선택 모드**:
      - 현재 값이 첫 번째 옵션과 다를 때만 리셋 버튼이 나타납니다
      - 리셋 시 첫 번째 옵션으로 되돌아갑니다

      **다중 선택 모드**:
      - 하나 이상 선택되었을 때 리셋 버튼이 나타납니다
      - 리셋 시 모든 선택이 해제됩니다

      **참고**: 부울린 속성은 JavaScript로 설정하거나 속성 제거로 제어해야 합니다.
    `,
    code: `
      <!-- 리셋 버튼 활성화 (기본) -->
      <seo-select id="with-reset" name="with-reset" width="200px">
        <option value="default">기본값</option>
        <option value="option1">옵션 1</option>
        <option value="option2" selected>옵션 2</option>
      </seo-select>

      <!-- 리셋 버튼 비활성화 -->
      <seo-select id="no-reset" name="no-reset" width="200px">
        <option value="default">기본값</option>
        <option value="option1">옵션 1</option>
        <option value="option2" selected>옵션 2</option>
      </seo-select>

      <script>
        // JavaScript로 showReset 부울린 값 설정
        const noResetSelect = document.getElementById('no-reset');
        noResetSelect.showReset = false;
      </script>
    `,
    lang: 'html'
  },

  form: {
    title: '폼 연동',
    description: `
      <code>seo-select</code>는 <strong>formAssociated = true</strong>로 설정되어
      표준 HTML 폼과 완전히 호환됩니다.

      - <strong>name</strong> 속성으로 폼 필드명을 지정합니다
      - <strong>required</strong> 속성으로 필수 입력을 강제할 수 있습니다
      - 단일 선택: 선택된 옵션의 <code>value</code>가 전송됩니다
      - 다중 선택: 쉼표로 구분된 값들이 하나의 필드로 전송됩니다
      - 폼 검증 API와 연동되어 브라우저 기본 검증 메시지가 표시됩니다
    `,
    code: `
      <form id="demo-form">
        <label>
          선호 언어 (필수):
          <seo-select name="language" required width="200px">
            <option value="">선택해주세요</option>
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
          </seo-select>
        </label>

        <label>
          관심 기술 (다중 선택):
          <seo-select name="interests" multiple width="300px">
            <option value="frontend">프론트엔드</option>
            <option value="backend">백엔드</option>
            <option value="mobile">모바일</option>
            <option value="ai">인공지능</option>
            <option value="blockchain">블록체인</option>
          </seo-select>
        </label>

        <button type="submit">제출</button>
      </form>

      <script>
        document.getElementById('demo-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);

          for (const [key, value] of formData.entries()) {
            console.log(\`\${key}: \${value}\`);
          }
        });
      </script>
    `,
    lang: 'html'
  },

  styling: {
    title: '크기 및 스타일링',
    description: `
      <code>seo-select</code>의 크기는 다음과 같이 제어할 수 있습니다:

      - <strong>width</strong>: 셀렉트 박스의 너비 지정 (미지정 시 자동 계산)
      - <strong>height</strong>: 셀렉트 박스의 높이 (기본값: 100%)

      너비를 지정하지 않으면 모든 옵션 텍스트의 길이를 측정하여
      가장 긴 텍스트에 맞춰 자동으로 조절됩니다 (최소 100px).
      CSS 클래스나 스타일을 통해 추가적인 커스터마이징이 가능합니다.
    `,
    code: `
      <!-- 자동 너비 조절 -->
      <seo-select name="auto-width">
        <option value="short">짧음</option>
        <option value="very-long-option">매우 긴 옵션 텍스트입니다</option>
        <option value="medium">중간 길이</option>
      </seo-select>

      <!-- 고정 너비 -->
      <seo-select name="fixed-width" width="150px">
        <option value="a">옵션 A</option>
        <option value="b">옵션 B</option>
      </seo-select>
    `,
    lang: 'html'
  },
};