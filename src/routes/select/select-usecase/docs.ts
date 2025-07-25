export const docs = {
  ko:{
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
  },
  en: {
    basic: {
      title: 'Basic Select Usage',
      description: `
        <code>seo-select</code> can define options in two ways:

        1. **Slot method**: Declare <code>&lt;option&gt;</code> tags directly as children (priority applied)
        2. **Array method**: Pass array via <strong>optionItems</strong> property (fallback when no slot)

        <code>&lt;option&gt;</code> elements passed via slot are internally removed during initialization
        and converted to a separate structure for virtual scroll optimization.
        Options with the <strong>selected</strong> attribute are set as initial values,
        otherwise the first option becomes the default.
      `,
      code: `
        <!-- Slot method (recommended) -->
        <seo-select name="brand" width="200px">
          <option value="kia">Kia Motors</option>
          <option value="hyundai" selected>Hyundai Motor</option>
          <option value="bmw">BMW</option>
          <option value="benz">Mercedes-Benz</option>
        </seo-select>

        <!-- Array method (fallback) -->
        <seo-select name="brand-alt" width="200px"></seo-select>

        <script>
          const select = document.querySelector('seo-select[name="brand-alt"]');
          select.optionItems = [
            { value: 'kia', label: 'Kia Motors' },
            { value: 'hyundai', label: 'Hyundai Motor' },
            { value: 'bmw', label: 'BMW' },
            { value: 'benz', label: 'Mercedes-Benz' }
          ];
          select.value = 'hyundai'; // Set initial value
        </script>
      `,
      lang: 'html'
    },

    theme: {
      title: 'Theme System',
      description: `
        <code>seo-select</code> and <code>seo-select-search</code> support two themes:

        - <strong>basic</strong>: Basic straight-edge style (no border radius)
        - <strong>float</strong>: Floating style with rounded corners and shadow effects (default)

        <strong>Float theme</strong> features:
        - Rounded corners with 5px border-radius
        - Soft drop shadow effect
        - Dropdown appears at a more distant position (3.5rem)
        - Top-to-bottom slide animation effect (0.2s)
        - Search input field also has rounded top corners

        <strong>Basic theme</strong> features:
        - Straight corners (border-radius: 0)
        - No shadow effects
        - Immediately appearing dropdown (no animation)
        - Traditional select box style

        **Note**: When using float theme with search functionality,
        a gradient glow effect appears when focusing on the search input.
      `,
      code: `
        <!-- Float theme (default) - rounded corners and animation -->
        <seo-select name="float-single" theme="float" width="200px">
          <option value="option1">Float Option 1</option>
          <option value="option2">Float Option 2</option>
          <option value="option3">Float Option 3</option>
        </seo-select>

        <!-- Basic theme - straight corners and immediate display -->
        <seo-select name="basic-single" theme="basic" width="200px">
          <option value="option1">Basic Option 1</option>
          <option value="option2">Basic Option 2</option>
          <option value="option3">Basic Option 3</option>
        </seo-select>

        <script>
          // Set initial values for multiple selection
          document.querySelector('[name="float-multi"]').selectedValues = ['react', 'vue'];

          // Open the dropdown to see the differences between themes
          console.log('Theme demo ready');
        </script>
      `,
      lang: 'html'
    },

    darkmode: {
      title: 'Dark Mode Support',
      description: `
        <code>seo-select</code> and <code>seo-select-search</code> support dark mode
        with the <strong>dark</strong> attribute.

        <strong>Dark mode features</strong>:
        - Changes to dark background colors and bright text colors
        - All UI elements (dropdown, tags, buttons, search field) apply dark theme
        - Hover and focus states are also adjusted for dark mode
        - Float theme applies dark mode-specific shadow effects
        - Default value is <code>false</code> (light mode)

        <strong>Dark mode color system</strong>:
        - Background: Dark gray tones (#2d3748, #1a202c)
        - Text: Light gray (#e2e8f0, #a0aec0)
        - Border: Medium gray (#4a5568)
        - Accent: Blue tones (#63b3ed, #2b6cb0)
        - Error: Red (#e53e3e)

        **Note**: Dark mode works independently from system theme and
        can be changed dynamically with JavaScript.
      `,
      code: `
        <!-- Light mode (default) -->
        <seo-select name="light-mode" theme="float" width="200px">
          <option value="option1">Light Mode Option 1</option>
          <option value="option2">Light Mode Option 2</option>
          <option value="option3">Light Mode Option 3</option>
        </seo-select>

        <!-- Dark mode -->
        <seo-select name="dark-mode" theme="float" dark width="200px">
          <option value="option1">Dark Mode Option 1</option>
          <option value="option2">Dark Mode Option 2</option>
          <option value="option3">Dark Mode Option 3</option>
        </seo-select>

        <!-- Multiple selection dark mode -->
        <seo-select multiple name="dark-multi" theme="float" dark width="300px">
          <option value="js">JavaScript</option>
          <option value="ts">TypeScript</option>
          <option value="react">React</option>
          <option value="vue">Vue.js</option>
          <option value="node">Node.js</option>
        </seo-select>

        <!-- Search functionality with dark mode -->
        <seo-select-search name="dark-search" theme="float" dark width="250px">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="cherry">Cherry</option>
          <option value="date">Date</option>
          <option value="elderberry">Elderberry</option>
        </seo-select-search>

        <script>
          // Dynamic dark mode change with JavaScript
          const lightSelect = document.querySelector('[name="light-mode"]');
          const darkSelect = document.querySelector('[name="dark-mode"]');

          // Dark mode toggle example
          function toggleDarkMode() {
            lightSelect.dark = !lightSelect.dark;
            console.log('Dark mode:', lightSelect.dark ? 'enabled' : 'disabled');
          }

          // Set initial selection values
          document.querySelector('[name="dark-multi"]').selectedValues = ['js', 'react'];

          // Change light mode select to dark mode after 5 seconds
          setTimeout(() => {
            toggleDarkMode();
          }, 5000);
        </script>
      `,
      lang: 'html'
    },

    loading: {
      title: 'Loading State and Async Processing',
      description: `
        <code>seo-select</code> always displays a spinner and loading text when there are no options.

        - Opening the dropdown when options are empty automatically enters loading state
        - Loading state is immediately released when options are created via slot or <strong>optionItems</strong>
        - During loading, animated dots and "Loading options..." message are displayed
        - Virtual scroll is automatically initialized when async data loading is complete
        - Selects with existing options do not show loading state
      `,
      code: `
        <!-- Empty select with no options - loading state shown when dropdown opens -->
        <seo-select name="loading-demo" width="250px">
          <!-- Loading starts from empty state -->
        </seo-select>

        <!-- Select with options - no loading state shown -->
        <seo-select name="normal-select" width="250px">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </seo-select>

        <script>
          const loadingSelect = document.querySelector('seo-select[name="loading-demo"]');

          // In actual use, dynamically load options via API calls, etc.
          setTimeout(() => {
            loadingSelect.optionItems = [
              { value: 'loading1', label: 'Loaded Option 1' },
              { value: 'loading2', label: 'Loaded Option 2' },
              { value: 'loading3', label: 'Loaded Option 3' }
            ];
            // Loading state is immediately released when options are set
          }, 2000);
        </script>
      `,
      lang: 'html'
    },

    virtual: {
      title: 'Virtual Scrolling and Large Datasets',
      description: `
        <code>seo-select</code> uses the <strong>InteractiveVirtualSelect</strong> utility
        to handle thousands of options without performance degradation.

        - Only options in the visible area are rendered in the actual DOM for memory efficiency
        - Options are dynamically reused during scrolling and optimized through rendering pools
        - Virtual scroll automatically synchronizes during keyboard navigation
        - If <strong>width</strong> attribute is not specified, it measures option text length for automatic adjustment
      `,
      code: `
        <seo-select id="large-dataset" name="item" width="300px"></seo-select>

        <script>
          const select = document.getElementById('large-dataset');

          // Generate 10,000 options
          select.optionItems = Array.from({ length: 10000 }, (_, i) => ({
            value: \`item-\${i.toString().padStart(4, '0')}\`,
            label: \`Item \${i.toString().padStart(4, '0')} - Long text description\`
          }));

          // Renders immediately without performance impact
          console.log('Large dataset loading complete');
        </script>
      `,
      lang: 'html'
    },

    keyboard: {
      title: 'Keyboard Navigation',
      description: `
        <code>seo-select</code> provides complete keyboard accessibility:

        - <strong>Tab</strong>: Move focus to select
        - <strong>↓ (Down arrow)</strong>: Move to next option
        - <strong>↑ (Up arrow)</strong>: Move to previous option
        - <strong>Enter</strong>: Select currently focused option
        - <strong>ESC</strong>: Close dropdown

        Focused options automatically scroll to visible area,
        and <strong>InteractiveVirtualSelect</strong> handles keyboard events.
      `,
      code: `
        <seo-select name="navigation-test" width="250px">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
          <option value="option4">Option 4</option>
          <option value="option5">Option 5</option>
          <option value="option6">Option 6</option>
          <option value="option7">Option 7</option>
          <option value="option8">Option 8</option>
          <option value="option9">Option 9</option>
          <option value="option10">Option 10</option>
        </seo-select>

        <!-- Focus with Tab and then control with keyboard -->
      `,
      lang: 'html'
    },

    events: {
      title: 'Event Handling',
      description: `
        <code>seo-select</code> fires the following custom events:

        - <strong>onSelect</strong>: Fired when option is selected (passes <code>{ value, label }</code>)
        - <strong>onDeselect</strong>: Fired when tag is removed in multiple selection (multiple mode only)
        - <strong>onReset</strong>: Fired when reset button is clicked
        - <strong>change</strong>: Standard change event (for form integration)

        Events are set with <code>bubbles: true, composed: true</code>
        so they can be caught by parent elements.

        **Note**: Manipulate the select in the example below to see event logs in the browser console.
      `,
      code: `
        <seo-select id="event-demo" name="demo" width="200px">
          <option value="a">Option A</option>
          <option value="b">Option B</option>
          <option value="c">Option C</option>
        </seo-select>

        <script>
          const select = document.getElementById('event-demo');

          select.addEventListener('onSelect', (e) => {
            const { value, label } = e.detail;
            console.log('Selected:', value, label);
          });

          select.addEventListener('onReset', (e) => {
            console.log('Reset:', e.detail);
          });

          select.addEventListener('change', (e) => {
            console.log('Form value changed:', e.target.value);
          });
        </script>
      `,
      lang: 'html'
    },

    multiple: {
      title: 'Multiple Selection Mode',
      description: `
        Adding the <strong>multiple</strong> attribute allows selecting multiple options simultaneously.

        - Selected values are displayed as tags, each with a delete button
        - Access selected values via the <strong>selectedValues</strong> array
        - The <strong>value</strong> attribute returns a comma-separated string (for form submission)
        - Already selected options are excluded from the dropdown display
        - When tags are removed, the corresponding options reappear in the dropdown

        **Note**: Click tags to remove them or make additional selections from the dropdown
        to trigger <code>onSelect</code> and <code>onDeselect</code> events.
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

          // Set initial selection values
          multiSelect.selectedValues = ['js', 'ts', 'react'];

          multiSelect.addEventListener('onSelect', (e) => {
            console.log('Additional selection:', e.detail);
            console.log('All current selections:', multiSelect.selectedValues);
          });

          multiSelect.addEventListener('onDeselect', (e) => {
            console.log('Deselected:', e.detail);
          });
        </script>
      `,
      lang: 'html'
    },

    reset: {
      title: 'Reset Functionality',
      description: `
        The reset button is displayed according to the <strong>showReset</strong> attribute (default: true).

        **Single selection mode**:
        - Reset button appears only when current value differs from the first option
        - Reset returns to the first option

        **Multiple selection mode**:
        - Reset button appears when one or more items are selected
        - Reset clears all selections

        **Note**: Boolean attributes must be controlled via JavaScript setting or attribute removal.
      `,
      code: `
        <!-- Reset button enabled (default) -->
        <seo-select id="with-reset" name="with-reset" width="200px">
          <option value="default">Default</option>
          <option value="option1">Option 1</option>
          <option value="option2" selected>Option 2</option>
        </seo-select>

        <!-- Reset button disabled -->
        <seo-select id="no-reset" name="no-reset" width="200px">
          <option value="default">Default</option>
          <option value="option1">Option 1</option>
          <option value="option2" selected>Option 2</option>
        </seo-select>

        <script>
          // Set showReset boolean value via JavaScript
          const noResetSelect = document.getElementById('no-reset');
          noResetSelect.showReset = false;
        </script>
      `,
      lang: 'html'
    },

    form: {
      title: 'Form Integration',
      description: `
        <code>seo-select</code> is set with <strong>formAssociated = true</strong>
        for full compatibility with standard HTML forms.

        - Specify form field name with the <strong>name</strong> attribute
        - Enforce required input with the <strong>required</strong> attribute
        - Single selection: Selected option's <code>value</code> is submitted
        - Multiple selection: Comma-separated values are submitted as one field
        - Integrated with form validation API to display browser default validation messages
      `,
      code: `
        <form id="demo-form">
          <label>
            Preferred Language (Required):
            <seo-select name="language" required width="200px">
              <option value="">Please select</option>
              <option value="ko">Korean</option>
              <option value="en">English</option>
              <option value="ja">Japanese</option>
            </seo-select>
          </label>

          <label>
            Interests (Multiple Selection):
            <seo-select name="interests" multiple width="300px">
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="mobile">Mobile</option>
              <option value="ai">AI</option>
              <option value="blockchain">Blockchain</option>
            </seo-select>
          </label>

          <button type="submit">Submit</button>
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
      title: 'Size and Styling',
      description: `
        The size of <code>seo-select</code> can be controlled as follows:

        - <strong>width</strong>: Specify select box width (auto-calculated if not specified)
        - <strong>height</strong>: Select box height (default: 100%)

        If width is not specified, it measures the length of all option texts
        and automatically adjusts to fit the longest text (minimum 100px).
        Additional customization is possible through CSS classes or styles.
      `,
      code: `
        <!-- Auto width adjustment -->
        <seo-select name="auto-width">
          <option value="short">Short</option>
          <option value="very-long-option">Very long option text here</option>
          <option value="medium">Medium length</option>
        </seo-select>

        <!-- Fixed width -->
        <seo-select name="fixed-width" width="150px">
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </seo-select>
      `,
      lang: 'html'
    },
  },
  ja: {
    basic: {
      title: '基本的なセレクトの使い方',
      description: `
        <code>seo-select</code>は2つの方法でオプションを定義できます：

        1. **slot方式**：<code>&lt;option&gt;</code>タグを直接子要素として記述（優先適用）
        2. **配列方式**：<strong>optionItems</strong>プロパティに配列を渡す（slotがない場合のフォールバック）

        slotで渡された<code>&lt;option&gt;</code>は初期化時に内部的に削除され、
        仮想スクロール最適化のための専用構造に変換されます。
        <strong>selected</strong>属性があるオプションが初期選択として設定され、
        指定がない場合は最初のオプションがデフォルトとなります。
      `,
      code: `
        <!-- slot方式（推奨） -->
        <seo-select name="brand" width="200px">
          <option value="toyota">トヨタ</option>
          <option value="honda" selected>ホンダ</option>
          <option value="nissan">日産</option>
          <option value="mazda">マツダ</option>
        </seo-select>

        <!-- 配列方式（フォールバック） -->
        <seo-select name="brand-alt" width="200px"></seo-select>

        <script>
          const select = document.querySelector('seo-select[name="brand-alt"]');
          select.optionItems = [
            { value: 'toyota', label: 'トヨタ' },
            { value: 'honda', label: 'ホンダ' },
            { value: 'nissan', label: '日産' },
            { value: 'mazda', label: 'マツダ' }
          ];
          select.value = 'honda'; // 初期値設定
        </script>
      `,
      lang: 'html'
    },

    theme: {
      title: 'テーマシステム',
      description: `
        <code>seo-select</code>および<code>seo-select-search</code>は2種類のテーマをサポートしています：

        - <strong>basic</strong>：角ばったスタイル（border-radiusなし）
        - <strong>float</strong>：丸みと影のあるフローティングスタイル（デフォルト）

        <strong>floatテーマの特徴</strong>：
        - 5pxの丸い角
        - 滑らかなドロップシャドウ効果
        - ドロップダウンは下に3.5rem離れて表示
        - 上から下へスライドするアニメーション（0.2秒）
        - 検索入力欄も角が丸くなります

        <strong>basicテーマの特徴</strong>：
        - 角ばった角（border-radius: 0）
        - シャドウ効果なし
        - 即座に表示されるドロップダウン（アニメなし）
        - 伝統的なセレクトボックスの見た目

        **備考**：検索付きセレクトでfloatテーマを使用する場合、
        フォーカス時にグラデーションのグロー効果が表示されます。
      `,
      code: `
        <!-- Floatテーマ（デフォルト）- 丸い角とアニメーション -->
        <seo-select name="float-single" theme="float" width="200px">
          <option value="option1">フロートオプション1</option>
          <option value="option2">フロートオプション2</option>
          <option value="option3">フロートオプション3</option>
        </seo-select>

        <!-- Basicテーマ - 角張った角と即座に表示 -->
        <seo-select name="basic-single" theme="basic" width="200px">
          <option value="option1">ベーシックオプション1</option>
          <option value="option2">ベーシックオプション2</option>
          <option value="option3">ベーシックオプション3</option>
        </seo-select>

        <script>
          // 複数選択の初期値設定
          document.querySelector('[name="float-multi"]').selectedValues = ['react', 'vue'];

          // ドロップダウンを開くとテーマごとの違いが確認できます
          console.log('テーマデモ準備完了');
        </script>
      `,
      lang: 'html'
    },

    darkmode: {
      title: 'ダークモード対応',
      description: `
        <code>seo-select</code>および<code>seo-select-search</code>は
        <strong>dark</strong>属性によりダークモードをサポートします。

        <strong>ダークモードの特徴</strong>：
        - 暗い背景と明るい文字色
        - 全UI（ドロップダウン、タグ、ボタン、検索）にダークテーマ適用
        - ホバー・フォーカス時の視覚効果もダークモード用に調整
        - floatテーマではダーク専用の影効果も適用
        - デフォルトは<code>false</code>（ライトモード）

        <strong>カラースキーム例</strong>：
        - 背景：濃いグレー系（#2d3748, #1a202c）
        - テキスト：明るいグレー（#e2e8f0, #a0aec0）
        - 境界線：中間グレー（#4a5568）
        - アクセント：青系（#63b3ed, #2b6cb0）
        - エラー：赤（#e53e3e）

        **補足**：システムテーマとは独立しており、
        JavaScriptで動的に切り替え可能です。
      `,
      code: `
        <!-- ライトモード（デフォルト） -->
        <seo-select name="light-mode" theme="float" width="200px">
          <option value="option1">ライトモードオプション1</option>
          <option value="option2">ライトモードオプション2</option>
          <option value="option3">ライトモードオプション3</option>
        </seo-select>

        <!-- ダークモード -->
        <seo-select name="dark-mode" theme="float" dark width="200px">
          <option value="option1">ダークモードオプション1</option>
          <option value="option2">ダークモードオプション2</option>
          <option value="option3">ダークモードオプション3</option>
        </seo-select>

        <!-- 複数選択ダークモード -->
        <seo-select multiple name="dark-multi" theme="float" dark width="300px">
          <option value="js">JavaScript</option>
          <option value="ts">TypeScript</option>
          <option value="react">React</option>
          <option value="vue">Vue.js</option>
          <option value="node">Node.js</option>
        </seo-select>

        <!-- 検索機能付きダークモード -->
        <seo-select-search name="dark-search" theme="float" dark width="250px">
          <option value="apple">りんご</option>
          <option value="banana">バナナ</option>
          <option value="cherry">さくらんぼ</option>
          <option value="date">なつめ</option>
          <option value="elderberry">エルダーベリー</option>
        </seo-select-search>

        <script>
          // JavaScriptでダークモードを動的に変更
          const lightSelect = document.querySelector('[name="light-mode"]');
          const darkSelect = document.querySelector('[name="dark-mode"]');

          // ダークモード切り替えの例
          function toggleDarkMode() {
            lightSelect.dark = !lightSelect.dark;
            console.log('ダークモード:', lightSelect.dark ? '有効' : '無効');
          }

          // 初期選択値の設定
          document.querySelector('[name="dark-multi"]').selectedValues = ['js', 'react'];

          // 5秒後にライトモードセレクトをダークモードに変更
          setTimeout(() => {
            toggleDarkMode();
          }, 5000);
        </script>
      `,
      lang: 'html'
    },

    loading: {
      title: 'ローディング状態と非同期処理',
      description: `
        <code>seo-select</code>は、オプションがない場合に必ずスピナーと
        ローディングテキストを表示します。

        - 空の状態でドロップダウンを開くと自動的にローディングになります
        - slotや<strong>optionItems</strong>でオプションが設定されると、すぐにローディング解除
        - ローディング中はアニメーションドットと「オプション読み込み中...」が表示されます
        - 非同期でデータ読み込みが完了すると、仮想スクロールも初期化されます
        - オプションがある状態ではローディングは発生しません
      `,
      code: `
        <!-- オプションがない空のセレクト - ドロップダウンを開くとローディング状態が表示される -->
        <seo-select name="loading-demo" width="250px">
          <!-- 空の状態からローディングが開始される -->
        </seo-select>

        <!-- オプションがあるセレクト - ローディング状態は表示されない -->
        <seo-select name="normal-select" width="250px">
          <option value="option1">オプション1</option>
          <option value="option2">オプション2</option>
        </seo-select>

        <script>
          const loadingSelect = document.querySelector('seo-select[name="loading-demo"]');

          // 実際の使用時にはAPI呼び出しなどでオプションを動的に読み込み
          setTimeout(() => {
            loadingSelect.optionItems = [
              { value: 'loading1', label: '読み込まれたオプション1' },
              { value: 'loading2', label: '読み込まれたオプション2' },
              { value: 'loading3', label: '読み込まれたオプション3' }
            ];
            // オプションが設定されると即座にローディング状態が解除される
          }, 2000);
        </script>
      `,
      lang: 'html'
    },

    virtual: {
      title: '仮想スクロールと大量データ',
      description: `
        <code>seo-select</code>は<strong>InteractiveVirtualSelect</strong>ユーティリティを使用して、
        数千件のオプションでもパフォーマンスを維持できます。

        - DOMには可視領域のみをレンダリング（メモリ節約）
        - スクロールに応じてオプションが再利用・再描画されます
        - キーボードナビゲーション時にも仮想スクロールが連動します
        - <strong>width</strong>を指定しない場合、オプションの文字列長に合わせて自動調整されます
      `,
      code: `
        <seo-select id="large-dataset" name="item" width="300px"></seo-select>

        <script>
          const select = document.getElementById('large-dataset');

          // 10,000個のオプションを生成
          select.optionItems = Array.from({ length: 10000 }, (_, i) => ({
            value: \`item-\${i.toString().padStart(4, '0')}\`,
            label: \`アイテム \${i.toString().padStart(4, '0')} - 長いテキスト説明\`
          }));

          // パフォーマンスに影響なく即座にレンダリングされる
          console.log('大容量データの読み込み完了');
        </script>
      `,
      lang: 'html'
    },

    keyboard: {
      title: 'キーボード操作',
      description: `
        <code>seo-select</code>は完全なキーボードアクセシビリティを提供します：

        - <strong>Tab</strong>：フォーカス移動
        - <strong>↓</strong>：次のオプションへ
        - <strong>↑</strong>：前のオプションへ
        - <strong>Enter</strong>：現在のオプションを選択
        - <strong>ESC</strong>：ドロップダウンを閉じる

        フォーカスされたオプションは自動的に表示領域へスクロールされ、
        <strong>InteractiveVirtualSelect</strong>がキーイベントを処理します。
      `,
      code: `
        <seo-select name="navigation-test" width="250px">
          <option value="option1">オプション1</option>
          <option value="option2">オプション2</option>
          <option value="option3">オプション3</option>
          <option value="option4">オプション4</option>
          <option value="option5">オプション5</option>
          <option value="option6">オプション6</option>
          <option value="option7">オプション7</option>
          <option value="option8">オプション8</option>
          <option value="option9">オプション9</option>
          <option value="option10">オプション10</option>
        </seo-select>

        <!-- Tabでフォーカス移動後、キーボードで操作可能 -->
      `,
      lang: 'html'
    },

    events: {
      title: 'イベント処理',
      description: `
        <code>seo-select</code>は以下のカスタムイベントを発行します：

        - <strong>onSelect</strong>：オプション選択時（<code>{ value, label }</code>を渡す）
        - <strong>onDeselect</strong>：複数選択でタグ削除時（multipleモードのみ）
        - <strong>onReset</strong>：リセットボタン押下時
        - <strong>change</strong>：標準のchangeイベント（フォーム連携用）

        すべてのイベントは<code>bubbles: true, composed: true</code>で発行され、
        親コンポーネントからも取得可能です。

        **備考**：以下のデモを操作すると、ブラウザのコンソールでログが確認できます。
      `,
      code: `
        <seo-select id="event-demo" name="demo" width="200px">
          <option value="a">オプションA</option>
          <option value="b">オプションB</option>
          <option value="c">オプションC</option>
        </seo-select>

        <script>
          const select = document.getElementById('event-demo');

          select.addEventListener('onSelect', (e) => {
            const { value, label } = e.detail;
            console.log('選択された:', value, label);
          });

          select.addEventListener('onReset', (e) => {
            console.log('リセットされた:', e.detail);
          });

          select.addEventListener('change', (e) => {
            console.log('フォーム値が変更された:', e.target.value);
          });
        </script>
      `,
      lang: 'html'
    },

    multiple: {
      title: '複数選択モード',
      description: `
        <strong>multiple</strong>属性を追加すると、複数のオプションを同時に選択できます。

        - 選択された値はタグとして表示され、各タグに削除ボタンあり
        - <strong>selectedValues</strong>配列で選択された値にアクセス可能
        - <strong>value</strong>プロパティはカンマ区切りの文字列を返します（フォーム送信用）
        - 選択済みのオプションはドロップダウンから非表示になります
        - タグ削除時には該当オプションが再び選択肢に戻ります

        **備考**：タグクリックやドロップダウンでの選択に応じて、
        <code>onSelect</code>や<code>onDeselect</code>イベントが発生します。
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

          // 初期選択値の設定
          multiSelect.selectedValues = ['js', 'ts', 'react'];

          multiSelect.addEventListener('onSelect', (e) => {
            console.log('追加選択:', e.detail);
            console.log('現在のすべての選択値:', multiSelect.selectedValues);
          });

          multiSelect.addEventListener('onDeselect', (e) => {
            console.log('選択解除:', e.detail);
          });
        </script>
      `,
      lang: 'html'
    },

    reset: {
      title: 'リセット機能',
      description: `
        <strong>showReset</strong>属性（デフォルト: true）によりリセットボタンの表示を制御できます。

        **単一選択モード**：
        - 現在の値が最初のオプションと異なる場合のみ表示されます
        - リセット時は最初のオプションに戻ります

        **複数選択モード**：
        - 1つ以上選択されているときにボタンが表示されます
        - リセットするとすべての選択が解除されます

        **補足**：boolean属性はJavaScriptで制御または属性削除により変更します。
      `,
      code: `
        <!-- リセットボタン有効（デフォルト） -->
        <seo-select id="with-reset" name="with-reset" width="200px">
          <option value="default">デフォルト値</option>
          <option value="option1">オプション1</option>
          <option value="option2" selected>オプション2</option>
        </seo-select>

        <!-- リセットボタン無効 -->
        <seo-select id="no-reset" name="no-reset" width="200px">
          <option value="default">デフォルト値</option>
          <option value="option1">オプション1</option>
          <option value="option2" selected>オプション2</option>
        </seo-select>

        <script>
          // JavaScriptでshowResetブール値を設定
          const noResetSelect = document.getElementById('no-reset');
          noResetSelect.showReset = false;
        </script>
      `,
      lang: 'html'
    },

    form: {
      title: 'フォームとの連携',
      description: `
        <code>seo-select</code>は<strong>formAssociated = true</strong>として設定されており、
        標準HTMLフォームと完全に連携します。

        - <strong>name</strong>属性でフィールド名を指定
        - <strong>required</strong>で必須入力に設定可能
        - 単一選択：選択されたオプションの<code>value</code>が送信されます
        - 複数選択：カンマ区切りの文字列で1つのフィールドに送信されます
        - HTMLフォームのバリデーションAPIにも対応しています
      `,
      code: `
        <form id="demo-form">
          <label>
            好みの言語（必須）:
            <seo-select name="language" required width="200px">
              <option value="">選択してください</option>
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </seo-select>
          </label>

          <label>
            関心のある技術（複数選択）:
            <seo-select name="interests" multiple width="300px">
              <option value="frontend">フロントエンド</option>
              <option value="backend">バックエンド</option>
              <option value="mobile">モバイル</option>
              <option value="ai">人工知能</option>
              <option value="blockchain">ブロックチェーン</option>
            </seo-select>
          </label>

          <button type="submit">送信</button>
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
      title: 'サイズとスタイリング',
      description: `
        <code>seo-select</code>のサイズは以下のように制御できます：

        - <strong>width</strong>：セレクトボックスの幅（未指定時は自動計算）
        - <strong>height</strong>：高さ指定（デフォルト: 100%）

        幅が指定されていない場合、すべてのオプションの長さを測定して、
        最も長いテキストに合わせて自動調整されます（最小幅100px）。
        CSSクラスやスタイルを使って追加のカスタマイズも可能です。
      `,
      code: `
        <!-- 自動幅調整 -->
        <seo-select name="auto-width">
          <option value="short">短い</option>
          <option value="very-long-option">とても長いオプションテキストです</option>
          <option value="medium">中程度の長さ</option>
        </seo-select>

        <!-- 固定幅 -->
        <seo-select name="fixed-width" width="150px">
          <option value="a">オプションA</option>
          <option value="b">オプションB</option>
        </seo-select>
      `,
      lang: 'html'
    },
  },
  zh: {
    basic: {
      title: '基本使用方法',
      description: `
        <code>seo-select</code>支持两种方式定义选项：

        1. **slot 方式**：直接作为子元素添加<code>&lt;option&gt;</code>标签（优先使用）
        2. **数组方式**：通过 <strong>optionItems</strong> 属性传入数组（无 slot 时使用）

        通过 slot 传入的<code>&lt;option&gt;</code>在初始化时会被内部移除，
        并转换为用于虚拟滚动优化的结构。
        含有 <strong>selected</strong> 属性的选项会被设为初始选中项，
        否则默认选中第一个选项。
      `,
      code: `
        <!-- slot方式（推荐） -->
        <seo-select name="brand" width="200px">
          <option value="byd">比亚迪</option>
          <option value="geely" selected>吉利汽车</option>
          <option value="nio">蔚来</option>
          <option value="xpeng">小鹏汽车</option>
        </seo-select>

        <!-- 数组方式（备用） -->
        <seo-select name="brand-alt" width="200px"></seo-select>

        <script>
          const select = document.querySelector('seo-select[name="brand-alt"]');
          select.optionItems = [
            { value: 'byd', label: '比亚迪' },
            { value: 'geely', label: '吉利汽车' },
            { value: 'nio', label: '蔚来' },
            { value: 'xpeng', label: '小鹏汽车' }
          ];
          select.value = 'geely'; // 设置初始值
        </script>
      `,
      lang: 'html'
    },

    theme: {
      title: '主题系统',
      description: `
        <code>seo-select</code> 和 <code>seo-select-search</code> 支持两种主题样式：

        - <strong>basic</strong>：传统直角风格（无圆角）
        - <strong>float</strong>：带圆角和阴影的悬浮风格（默认）

        <strong>float 主题特点</strong>：
        - 5px 圆角边框
        - 柔和的下拉阴影效果
        - 下拉菜单以 3.5rem 距离下移显示
        - 从上往下的滑动动画（0.2秒）
        - 搜索输入框也有圆角处理

        <strong>basic 主题特点</strong>：
        - 无圆角（border-radius: 0）
        - 无阴影效果
        - 下拉菜单立即显示（无动画）
        - 外观类似传统 select 元素

        **提示**：启用搜索功能时使用 float 主题，
        聚焦输入框时会出现渐变发光效果。
      `,
      code: `
        <!-- Float主题（默认）- 圆角和动画效果 -->
        <seo-select name="float-single" theme="float" width="200px">
          <option value="option1">浮动选项1</option>
          <option value="option2">浮动选项2</option>
          <option value="option3">浮动选项3</option>
        </seo-select>

        <!-- Basic主题 - 直角和立即显示 -->
        <seo-select name="basic-single" theme="basic" width="200px">
          <option value="option1">基础选项1</option>
          <option value="option2">基础选项2</option>
          <option value="option3">基础选项3</option>
        </seo-select>

        <script>
          // 设置多选初始值
          document.querySelector('[name="float-multi"]').selectedValues = ['react', 'vue'];

          // 打开下拉菜单可以看到不同主题的差异
          console.log('主题演示准备完成');
        </script>
      `,
      lang: 'html'
    },

    darkmode: {
      title: '暗黑模式支持',
      description: `
        <code>seo-select</code> 和 <code>seo-select-search</code> 支持通过 <strong>dark</strong> 属性启用暗黑模式。

        <strong>暗黑模式特点</strong>：
        - 深色背景与浅色文字
        - 所有 UI 元素（下拉框、标签、按钮、搜索框）均切换为暗黑主题
        - hover 和 focus 状态视觉样式适配暗黑风格
        - float 主题下有专属暗黑阴影样式
        - 默认值为 <code>false</code>（即浅色模式）

        <strong>暗黑配色示例</strong>：
        - 背景色：深灰 (#2d3748, #1a202c)
        - 文字色：浅灰 (#e2e8f0, #a0aec0)
        - 边框色：中灰 (#4a5568)
        - 高亮色：蓝色 (#63b3ed, #2b6cb0)
        - 错误色：红色 (#e53e3e)

        **说明**：暗黑模式不依赖系统主题，可通过 JavaScript 动态切换。
      `,
      code: `
        <!-- 浅色模式（默认） -->
        <seo-select name="light-mode" theme="float" width="200px">
          <option value="option1">浅色模式选项1</option>
          <option value="option2">浅色模式选项2</option>
          <option value="option3">浅色模式选项3</option>
        </seo-select>

        <!-- 暗黑模式 -->
        <seo-select name="dark-mode" theme="float" dark width="200px">
          <option value="option1">暗黑模式选项1</option>
          <option value="option2">暗黑模式选项2</option>
          <option value="option3">暗黑模式选项3</option>
        </seo-select>

        <!-- 多选暗黑模式 -->
        <seo-select multiple name="dark-multi" theme="float" dark width="300px">
          <option value="js">JavaScript</option>
          <option value="ts">TypeScript</option>
          <option value="react">React</option>
          <option value="vue">Vue.js</option>
          <option value="node">Node.js</option>
        </seo-select>

        <!-- 带搜索功能的暗黑模式 -->
        <seo-select-search name="dark-search" theme="float" dark width="250px">
          <option value="apple">苹果</option>
          <option value="banana">香蕉</option>
          <option value="cherry">樱桃</option>
          <option value="date">枣子</option>
          <option value="elderberry">接骨木莓</option>
        </seo-select-search>

        <script>
          // 用JavaScript动态改变暗黑模式
          const lightSelect = document.querySelector('[name="light-mode"]');
          const darkSelect = document.querySelector('[name="dark-mode"]');

          // 暗黑模式切换示例
          function toggleDarkMode() {
            lightSelect.dark = !lightSelect.dark;
            console.log('暗黑模式:', lightSelect.dark ? '启用' : '禁用');
          }

          // 设置初始选择值
          document.querySelector('[name="dark-multi"]').selectedValues = ['js', 'react'];

          // 5秒后将浅色模式选择器切换为暗黑模式
          setTimeout(() => {
            toggleDarkMode();
          }, 5000);
        </script>
      `,
      lang: 'html'
    },

    loading: {
      title: '加载状态与异步处理',
      description: `
        当选项为空时，<code>seo-select</code> 会自动进入加载状态并显示加载提示。

        - 打开下拉框时若无选项，则自动显示加载动画
        - 通过 slot 或 <strong>optionItems</strong> 设置选项后，立即退出加载状态
        - 加载中会显示动画点和"正在加载选项..."提示
        - 异步加载完成后会自动初始化虚拟滚动
        - 若已有选项则不会进入加载状态
      `,
      code: `
        <!-- 无选项的空选择器 - 打开下拉菜单时显示加载状态 -->
        <seo-select name="loading-demo" width="250px">
          <!-- 空状态下开始加载 -->
        </seo-select>

        <!-- 有选项的选择器 - 不显示加载状态 -->
        <seo-select name="normal-select" width="250px">
          <option value="option1">选项1</option>
          <option value="option2">选项2</option>
        </seo-select>

        <script>
          const loadingSelect = document.querySelector('seo-select[name="loading-demo"]');

          // 实际使用中通过API调用等方式动态加载选项
          setTimeout(() => {
            loadingSelect.optionItems = [
              { value: 'loading1', label: '已加载选项1' },
              { value: 'loading2', label: '已加载选项2' },
              { value: 'loading3', label: '已加载选项3' }
            ];
            // 设置选项后立即退出加载状态
          }, 2000);
        </script>
      `,
      lang: 'html'
    },

    virtual: {
      title: '虚拟滚动与海量数据',
      description: `
        <code>seo-select</code> 使用 <strong>InteractiveVirtualSelect</strong> 工具类，
        即使是成千上万条数据也能流畅显示。

        - 实际 DOM 仅渲染可视区域选项，节省内存
        - 滚动时动态复用和渲染选项节点
        - 键盘导航与虚拟滚动联动
        - 若未设置 <strong>width</strong> 属性，会根据选项内容自动调整宽度
      `,
      code: `
        <seo-select id="large-dataset" name="item" width="300px"></seo-select>

        <script>
          const select = document.getElementById('large-dataset');

          // 生成10,000个选项
          select.optionItems = Array.from({ length: 10000 }, (_, i) => ({
            value: \`item-\${i.toString().padStart(4, '0')}\`,
            label: \`项目 \${i.toString().padStart(4, '0')} - 长文本描述\`
          }));

          // 立即渲染，不影响性能
          console.log('大数据量加载完成');
        </script>
      `,
      lang: 'html'
    },

    keyboard: {
      title: '键盘导航',
      description: `
        <code>seo-select</code> 支持完整的键盘操作：

        - <strong>Tab</strong>：移动焦点到组件
        - <strong>↓</strong>：移动到下一个选项
        - <strong>↑</strong>：移动到上一个选项
        - <strong>Enter</strong>：选择当前高亮选项
        - <strong>ESC</strong>：关闭下拉菜单

        当前聚焦选项会自动滚动到可见区域，
        键盘事件由 <strong>InteractiveVirtualSelect</strong> 处理。
      `,
      code: `
        <seo-select name="navigation-test" width="250px">
          <option value="option1">选项1</option>
          <option value="option2">选项2</option>
          <option value="option3">选项3</option>
          <option value="option4">选项4</option>
          <option value="option5">选项5</option>
          <option value="option6">选项6</option>
          <option value="option7">选项7</option>
          <option value="option8">选项8</option>
          <option value="option9">选项9</option>
          <option value="option10">选项10</option>
        </seo-select>

        <!-- 用Tab移动焦点后可用键盘操作 -->
      `,
      lang: 'html'
    },

    events: {
      title: '事件处理',
      description: `
        <code>seo-select</code> 会触发以下自定义事件：

        - <strong>onSelect</strong>：选中选项时触发（包含 <code>{ value, label }</code>）
        - <strong>onDeselect</strong>：在多选模式中移除标签时触发
        - <strong>onReset</strong>：点击重置按钮时触发
        - <strong>change</strong>：标准表单 change 事件（用于表单提交）

        所有事件均具有 <code>bubbles: true, composed: true</code>，
        可在外层组件中监听。

        **提示**：通过控制台可查看各事件日志。
      `,
      code: `
        <seo-select id="event-demo" name="demo" width="200px">
          <option value="a">选项A</option>
          <option value="b">选项B</option>
          <option value="c">选项C</option>
        </seo-select>

        <script>
          const select = document.getElementById('event-demo');

          select.addEventListener('onSelect', (e) => {
            const { value, label } = e.detail;
            console.log('已选择:', value, label);
          });

          select.addEventListener('onReset', (e) => {
            console.log('已重置:', e.detail);
          });

          select.addEventListener('change', (e) => {
            console.log('表单值已更改:', e.target.value);
          });
        </script>
      `,
      lang: 'html'
    },

    multiple: {
      title: '多选模式',
      description: `
        添加 <strong>multiple</strong> 属性即可启用多选功能。

        - 所选项会以标签形式展示，每个标签可单独删除
        - 使用 <strong>selectedValues</strong> 获取当前所选值（数组）
        - <strong>value</strong> 属性返回逗号分隔的字符串（适用于表单提交）
        - 已选择的选项会从下拉中隐藏
        - 移除标签后，对应选项会重新出现在下拉中

        **说明**：选择或移除标签时会触发 <code>onSelect</code> 和 <code>onDeselect</code> 事件。
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

          // 设置初始选择值
          multiSelect.selectedValues = ['js', 'ts', 'react'];

          multiSelect.addEventListener('onSelect', (e) => {
            console.log('新增选择:', e.detail);
            console.log('当前所有选择值:', multiSelect.selectedValues);
          });

          multiSelect.addEventListener('onDeselect', (e) => {
            console.log('取消选择:', e.detail);
          });
        </script>
      `,
      lang: 'html'
    },

    reset: {
      title: '重置功能',
      description: `
        通过 <strong>showReset</strong> 属性（默认值：true）控制重置按钮是否显示。

        **单选模式**：
        - 当前值与第一个选项不同时显示重置按钮
        - 点击后会恢复为第一个选项

        **多选模式**：
        - 至少选择一个时显示按钮
        - 点击后清空所有选择

        **说明**：布尔属性可通过 JavaScript 设置或删除属性来控制。
      `,
      code: `
        <!-- 重置按钮启用（默认） -->
        <seo-select id="with-reset" name="with-reset" width="200px">
          <option value="default">默认值</option>
          <option value="option1">选项1</option>
          <option value="option2" selected>选项2</option>
        </seo-select>

        <!-- 重置按钮禁用 -->
        <seo-select id="no-reset" name="no-reset" width="200px">
          <option value="default">默认值</option>
          <option value="option1">选项1</option>
          <option value="option2" selected>选项2</option>
        </seo-select>

        <script>
          // 用JavaScript设置showReset布尔值
          const noResetSelect = document.getElementById('no-reset');
          noResetSelect.showReset = false;
        </script>
      `,
      lang: 'html'
    },

    form: {
      title: '表单集成',
      description: `
        <code>seo-select</code> 通过 <strong>formAssociated = true</strong> 实现与标准 HTML 表单的完美兼容。

        - 使用 <strong>name</strong> 指定字段名称
        - 使用 <strong>required</strong> 强制必填
        - 单选：提交当前选项的 <code>value</code>
        - 多选：以逗号分隔字符串提交多个值
        - 支持原生表单验证 API，显示默认验证消息
      `,
      code: `
        <form id="demo-form">
          <label>
            首选语言（必填）:
            <seo-select name="language" required width="200px">
              <option value="">请选择</option>
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </seo-select>
          </label>

          <label>
            感兴趣的技术（多选）:
            <seo-select name="interests" multiple width="300px">
              <option value="frontend">前端开发</option>
              <option value="backend">后端开发</option>
              <option value="mobile">移动开发</option>
              <option value="ai">人工智能</option>
              <option value="blockchain">区块链</option>
            </seo-select>
          </label>

          <button type="submit">提交</button>
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
      title: '尺寸与样式',
      description: `
        <code>seo-select</code> 的尺寸可通过以下方式控制：

        - <strong>width</strong>：设置下拉框宽度（默认自动）
        - <strong>height</strong>：设置高度（默认 100%）

        若未指定宽度，会自动测量所有选项文字长度，
        根据最长项自适应宽度（最小为 100px）。
        也可以通过 CSS 类或样式进一步自定义。
      `,
      code: `
        <!-- 自动宽度调整 -->
        <seo-select name="auto-width">
          <option value="short">短</option>
          <option value="very-long-option">非常长的选项文本内容</option>
          <option value="medium">中等长度</option>
        </seo-select>

        <!-- 固定宽度 -->
        <seo-select name="fixed-width" width="150px">
          <option value="a">选项A</option>
          <option value="b">选项B</option>
        </seo-select>
      `,
      lang: 'html'
    },
  }
};