export const docs = {
  basic: {
    title: '검색 셀렉트박스 기본 사용법',
    description: `
      <code>seo-select-search</code>는 초성 검색 기능을 포함한 고급 셀렉트 박스입니다.

      - 기본 <code>seo-select</code>의 모든 기능을 포함하며, 추가로 실시간 검색 기능을 제공합니다
      - 검색창은 드롭다운 상단에 고정되어 있으며, 옵션 목록 위에 표시됩니다
      - 한글 초성 검색을 지원하여 <code>ㄱ</code>, <code>ㄴ</code> 등의 자음으로도 검색할 수 있습니다
      - <strong>getChosungAll</strong> 유틸 함수를 내부적으로 사용하여 정확한 초성 매칭을 수행합니다
      - 옵션 정의 방식은 <code>seo-select</code>와 동일하게 slot 또는 <strong>optionItems</strong> 배열을 사용합니다
    `,
    code: `
      <!-- slot 방식으로 옵션 정의 -->
      <seo-select-search name="brand" width="250px">
        <option value="kia">기아자동차</option>
        <option value="hyundai" selected>현대자동차</option>
        <option value="bmw">BMW</option>
        <option value="benz">Mercedes-Benz</option>
        <option value="audi">Audi</option>
        <option value="volkswagen">Volkswagen</option>
      </seo-select-search>

      <!-- 배열 방식으로 옵션 정의 -->
      <seo-select-search id="dynamic-search" name="city" width="250px"></seo-select-search>

      <script>
        const searchSelect = document.getElementById('dynamic-search');
        searchSelect.optionItems = [
          { value: 'seoul', label: '서울특별시' },
          { value: 'busan', label: '부산광역시' },
          { value: 'daegu', label: '대구광역시' },
          { value: 'incheon', label: '인천광역시' },
          { value: 'gwangju', label: '광주광역시' },
          { value: 'daejeon', label: '대전광역시' }
        ];
      </script>
    `,
    lang: 'html'
  },

  theme: {
    title: '테마 시스템',
    description: `
      <code>seo-select-search</code>는 부모 클래스와 동일한 테마 시스템을 지원합니다:

      - <strong>basic</strong>: 기본적인 직각 모서리 스타일 (테두리 반경 없음)
      - <strong>float</strong>: 둥근 모서리와 그림자 효과가 있는 플로팅 스타일 (기본값)

      <strong>float 테마</strong>의 검색 기능 특징:
      - 검색 입력 필드의 상단 모서리가 둥글게 처리됨 (5px border-radius)
      - 검색 입력에 포커스 시 그라데이션 글로우 효과 적용
      - 드롭다운이 위에서 아래로 슬라이드되는 애니메이션
      - 전체적으로 부드럽고 모던한 사용자 경험

      <strong>basic 테마</strong>의 검색 기능 특징:
      - 직각 모서리의 전통적인 검색 입력 필드
      - 그림자나 애니메이션 효과 없음
      - 즉시 나타나는 드롭다운으로 빠른 반응성

      **참고**: 검색 입력 필드의 포커스 효과는 float 테마에서만 적용됩니다.
    `,
    code: `
      <!-- Float 테마 (기본값) - 검색 기능 포함 -->
      <seo-select-search name="search-float" theme="float" width="250px">
        <option value="js">JavaScript</option>
        <option value="ts">TypeScript</option>
        <option value="react">React</option>
        <option value="vue">Vue.js</option>
        <option value="angular">Angular</option>
        <option value="svelte">Svelte</option>
      </seo-select-search>

      <!-- Basic 테마 - 검색 기능 포함 -->
      <seo-select-search name="search-basic" theme="basic" width="250px">
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="go">Go</option>
        <option value="rust">Rust</option>
        <option value="php">PHP</option>
        <option value="ruby">Ruby</option>
      </seo-select-search>

      <script>
        // 드롭다운을 열고 검색해보세요:
        // Float 테마: "script", "ㅅㅋㄹㅍㅌ" 등으로 검색 시 부드러운 효과
        // Basic 테마: 동일한 검색이지만 즉시 반응하는 클래식한 느낌
        console.log('테마별 검색 기능 데모 준비 완료');
      </script>
    `,
    lang: 'html'
  },

  search: {
    title: '초성 검색 기능',
    description: `
      <code>seo-select-search</code>의 핵심 기능인 초성 검색은 한글 텍스트의 효율적인 필터링을 제공합니다.

      - **완전 매칭**: <code>"서울"</code> 입력 시 "서울특별시" 검색됨
      - **부분 매칭**: <code>"특별"</code> 입력 시 "서울**특별**시" 검색됨
      - **초성 검색**: <code>"ㅅㅇ"</code> 입력 시 "**서울**특별시" 검색됨
      - **혼합 검색**: <code>"ㅅ울시"</code> 입력 시 "**서울**특별**시**" 검색됨
      - 검색어가 없으면 모든 옵션이 표시되며, 매칭되는 항목이 없으면 "데이터가 없습니다." 메시지가 표시됩니다
      - 검색 중에도 키보드 네비게이션이 정상 작동하며, 필터된 결과 내에서 이동할 수 있습니다
    `,
    code: `
      <seo-select-search name="search-demo" width="300px">
        <option value="seoul">서울특별시</option>
        <option value="busan">부산광역시</option>
        <option value="daegu">대구광역시</option>
        <option value="incheon">인천광역시</option>
        <option value="gwangju">광주광역시</option>
        <option value="daejeon">대전광역시</option>
        <option value="ulsan">울산광역시</option>
        <option value="sejong">세종특별자치시</option>
        <option value="gyeonggi">경기도</option>
        <option value="gangwon">강원특별자치도</option>
      </seo-select-search>

      <!-- 드롭다운을 열고 다음과 같이 검색해보세요:
           - "서울" → 서울특별시 매칭
           - "ㅅㅇ" → 서울특별시 매칭
           - "광역" → 모든 광역시 매칭
           - "ㄱㅇ" → 광주광역시, 경기도 매칭 -->
    `,
    lang: 'html'
  },

  loading: {
    title: '로딩 상태 및 비동기 처리',
    description: `
      <code>seo-select-search</code>는 부모 클래스와 동일한 로딩 처리 메커니즘을 가집니다.

      - 옵션이 없는 상태에서 드롭다운을 열면 자동으로 로딩 스피너가 표시됩니다
      - 로딩 중에는 검색창 아래에 애니메이션 도트와 "옵션 로딩 중..." 메시지가 표시됩니다
      - slot 또는 <strong>optionItems</strong>를 통해 옵션이 생성되면 즉시 로딩 상태가 해제됩니다
      - 로딩 완료 후 검색 기능이 활성화되며, 기존 검색어가 있다면 자동으로 필터링됩니다
      - 비동기 API 호출 등으로 대용량 데이터를 로딩할 때 유용합니다
    `,
    code: `
      <!-- 빈 상태에서 시작하여 로딩 데모 -->
      <seo-select-search id="loading-demo" name="async-data" width="300px">
        <!-- 처음엔 비어있어서 드롭다운 열면 로딩 표시됨 -->
      </seo-select-search>

      <button onclick="loadData()">데이터 로딩 시작</button>

      <script>
        function loadData() {
          const select = document.getElementById('loading-demo');

          // 시뮬레이션: 2초 후 API 데이터 로딩 완료
          setTimeout(() => {
            select.optionItems = Array.from({ length: 50 }, (_, i) => ({
              value: \`item-\${i}\`,
              label: \`동적 로딩된 아이템 \${i + 1}\`
            }));
            console.log('데이터 로딩 완료 - 검색 기능 활성화');
          }, 2000);
        }
      </script>
    `,
    lang: 'html'
  },

  virtual: {
    title: '가상 스크롤링과 대용량 검색',
    description: `
      <code>seo-select-search</code>는 수천 개의 옵션에서도 실시간 검색이 가능합니다.

      - <strong>InteractiveVirtualSelect</strong>를 확장하여 검색 기능과 가상 스크롤을 통합했습니다
      - 검색어 입력 시 전체 데이터셋에서 필터링 후 가상 스크롤에 적용됩니다
      - 검색 결과가 많아도 가시 영역의 항목만 렌더링되어 성능이 유지됩니다
      - 검색어 변경 시 즉시 필터링되며, 첫 번째 매칭 항목에 포커스가 이동됩니다
      - 메모리 효율성과 검색 속도를 모두 보장하는 최적화된 구조입니다
    `,
    code: `
      <seo-select-search id="large-search" name="large-dataset" width="350px"></seo-select-search>

      <script>
        const largeSelect = document.getElementById('large-search');

        // 10,000개 아이템으로 대용량 데이터셋 생성
        largeSelect.optionItems = Array.from({ length: 10000 }, (_, i) => {
          const categories = ['프론트엔드', '백엔드', '데이터베이스', '인프라', '보안'];
          const category = categories[i % categories.length];
          return {
            value: \`item-\${i.toString().padStart(4, '0')}\`,
            label: \`[\${category}] 기술 스택 \${i.toString().padStart(4, '0')}\`
          };
        });

        console.log('10,000개 항목 로드 완료 - 검색해보세요!');

        // 검색 예시: "프론트", "ㅍㄹㅌ", "백엔드", "ㅂㅇㄷ" 등으로 검색 가능
      </script>
    `,
    lang: 'html'
  },

  multiple: {
    title: '다중 선택과 검색 조합',
    description: `
      다중 선택 모드에서는 검색 기능이 더욱 유용합니다.

      - 이미 선택된 항목들은 드롭다운에서 제외되어 검색 결과에 나타나지 않습니다
      - 태그 제거 시 해당 항목이 다시 검색 가능한 옵션으로 복귀됩니다
      - **모든 항목을 선택하면 "데이터 없음" 상태가 표시됩니다**
      - 검색어가 있는 상태에서 선택/해제 시에도 검색 필터가 유지됩니다
      - 대용량 옵션에서 특정 항목들을 빠르게 찾아 선택할 때 매우 효율적입니다
    `,
    code: `
      <seo-select-search multiple name="skills" width="400px">
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="react">React</option>
        <option value="vue">Vue.js</option>
        <option value="angular">Angular</option>
        <option value="svelte">Svelte</option>
        <option value="nodejs">Node.js</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="csharp">C#</option>
        <option value="php">PHP</option>
        <option value="ruby">Ruby</option>
        <option value="go">Go</option>
        <option value="rust">Rust</option>
        <option value="kotlin">Kotlin</option>
        <option value="swift">Swift</option>
      </seo-select-search>

      <script>
        const multiSearchSelect = document.querySelector('seo-select-search[multiple]');

        // 이벤트 리스너로 선택/해제 추적
        multiSearchSelect.addEventListener('onSelect', (e) => {
          console.log('선택됨:', e.detail);
          console.log('현재 선택된 모든 값:', multiSearchSelect.selectedValues);
        });

        multiSearchSelect.addEventListener('onDeselect', (e) => {
          console.log('해제됨:', e.detail);
        });

        // 검색 예시: "script", "ㅅㅋㄹㅍㅌ" 등으로 JavaScript/TypeScript 검색
      </script>
    `,
    lang: 'html'
  },

  events: {
    title: '검색 관련 이벤트 처리',
    description: `
      <code>seo-select-search</code>는 기본 셀렉트 이벤트 외에 검색 관련 동작도 추적할 수 있습니다.

      - **onSelect**: 검색 후 옵션 선택 시 발생 (검색어와 함께 선택된 값 확인 가능)
      - **onDeselect**: 다중 선택에서 태그 제거 시 발생 (검색 상태 유지됨)
      - **onReset**: 리셋 시 발생 (검색어도 함께 초기화됨)
      - **change**: 표준 폼 이벤트 (검색과 무관하게 값 변경 시 발생)
      - 검색어 변경 자체는 내부적으로 처리되며, 별도 이벤트를 발생시키지 않습니다
      - 드롭다운 닫기 시 검색어가 자동으로 초기화됩니다
    `,
    code: `
      <seo-select-search id="event-demo" name="demo" width="250px">
        <option value="option1">첫 번째 옵션</option>
        <option value="option2">두 번째 옵션</option>
        <option value="option3">세 번째 옵션</option>
        <option value="option4">네 번째 옵션</option>
        <option value="option5">다섯 번째 옵션</option>
      </seo-select-search>

      <div id="event-log" style="margin-top: 10px; padding: 10px; background: #f5f5f5; max-height: 100px; overflow-y: auto;"></div>

      <script>
        const searchSelect = document.getElementById('event-demo');
        const eventLog = document.getElementById('event-log');

        function logEvent(message) {
          const time = new Date().toLocaleTimeString();
          eventLog.innerHTML += \`<div>[\${time}] \${message}</div>\`;
          eventLog.scrollTop = eventLog.scrollHeight;
        }

        searchSelect.addEventListener('onSelect', (e) => {
          logEvent(\`선택: \${e.detail.label} (값: \${e.detail.value})\`);
        });

        searchSelect.addEventListener('onReset', (e) => {
          logEvent('리셋됨 - 검색어도 초기화');
        });

        searchSelect.addEventListener('change', (e) => {
          logEvent(\`폼 값 변경: \${e.target.value}\`);
        });

        // 검색하고 선택해보세요: "첫", "ㅊㅂ", "옵션" 등
      </script>
    `,
    lang: 'html'
  },

  form: {
    title: '폼 연동과 검증',
    description: `
      <code>seo-select-search</code>도 완전한 폼 호환성을 제공합니다.

      - <strong>formAssociated = true</strong>로 설정되어 표준 HTML 폼과 연동됩니다
      - 검색 기능은 UI 편의성일 뿐, 폼 전송 시에는 선택된 값만 전송됩니다
      - <strong>required</strong> 속성으로 필수 입력을 강제할 수 있습니다
      - 다중 선택 시에도 쉼표로 구분된 값이 하나의 필드로 전송됩니다
      - 검색어는 폼 데이터에 포함되지 않으며, 선택된 실제 값만 전송됩니다
    `,
    code: `
      <form id="search-form">
        <label>
          거주 지역 (필수):
          <seo-select-search name="region" required width="200px">
            <option value="">선택해주세요</option>
            <option value="seoul">서울특별시</option>
            <option value="busan">부산광역시</option>
            <option value="daegu">대구광역시</option>
            <option value="incheon">인천광역시</option>
            <option value="gwangju">광주광역시</option>
            <option value="daejeon">대전광역시</option>
            <option value="ulsan">울산광역시</option>
          </seo-select-search>
        </label>

        <label>
          관심 분야 (다중 선택):
          <seo-select-search name="interests" multiple width="300px">
            <option value="frontend">프론트엔드 개발</option>
            <option value="backend">백엔드 개발</option>
            <option value="mobile">모바일 앱 개발</option>
            <option value="ai">인공지능/머신러닝</option>
            <option value="blockchain">블록체인</option>
            <option value="devops">데브옵스/인프라</option>
            <option value="design">UI/UX 디자인</option>
            <option value="data">데이터 분석</option>
          </seo-select-search>
        </label>

        <button type="submit">제출</button>
      </form>

      <script>
        document.getElementById('search-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);

          console.log('=== 폼 제출 데이터 ===');
          for (const [key, value] of formData.entries()) {
            console.log(\`\${key}: \${value}\`);
          }
        });
      </script>
    `,
    lang: 'html'
  },
};