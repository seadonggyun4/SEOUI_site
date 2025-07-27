export const docs = {
  ko:{
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
    darkmode: {
      title: '다크 모드 지원',
      description: `
        <code>seo-select-search</code>는 <strong>dark</strong> 속성으로 다크 모드를 완벽하게 지원합니다.

        <strong>검색 기능과 다크 모드</strong>:
        - 검색 입력창도 다크 테마로 완전히 변환됩니다
        - 검색 아이콘 색상이 다크 모드에 맞게 자동 조정됩니다
        - 검색 입력 필드의 포커스 효과도 다크 모드 전용 스타일로 적용됩니다
        - 초성 검색 결과 하이라이팅도 다크 모드에서 가독성을 유지합니다
        - 로딩 스피너와 "데이터 없음" 메시지도 다크 테마로 표시됩니다

        <strong>다크 모드 검색창 특징</strong>:
        - 배경: 어두운 회색 (#2d3748)
        - 텍스트: 밝은 회색 (#e2e8f0)
        - 플레이스홀더: 중간 회색 (#718096)
        - 포커스 테두리: 파란색 계열 (#63b3ed)
        - 검색 아이콘: 보조 텍스트 색상 (#a0aec0)

        **참고**: 다크 모드는 기본 셀렉트와 마찬가지로 JavaScript로 동적 변경이 가능하며,
        검색 기능의 모든 상태(입력, 포커스, 결과 표시)에서 일관된 다크 테마를 제공합니다.
      `,
      code: `
        <!-- 라이트 모드 검색 셀렉트 (기본값) -->
        <seo-select-search name="light-search" theme="float" width="250px">
          <option value="apple">사과 (Apple)</option>
          <option value="banana">바나나 (Banana)</option>
          <option value="cherry">체리 (Cherry)</option>
          <option value="date">대추 (Date)</option>
          <option value="elderberry">엘더베리 (Elderberry)</option>
        </seo-select-search>

        <!-- 다크 모드 검색 셀렉트 -->
        <seo-select-search name="dark-search" theme="float" dark width="250px">
          <option value="apple">사과 (Apple)</option>
          <option value="banana">바나나 (Banana)</option>
          <option value="cherry">체리 (Cherry)</option>
          <option value="date">대추 (Date)</option>
          <option value="elderberry">엘더베리 (Elderberry)</option>
        </seo-select-search>

        <!-- 다중 선택 + 다크 모드 + 검색 -->
        <seo-select-search multiple name="dark-multi-search" theme="float" dark width="350px">
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

        <!-- Basic 테마 다크 모드 검색 -->
        <seo-select-search name="basic-dark-search" theme="basic" dark width="250px">
          <option value="frontend">프론트엔드</option>
          <option value="backend">백엔드</option>
          <option value="mobile">모바일</option>
          <option value="ai">인공지능</option>
          <option value="devops">데브옵스</option>
        </seo-select-search>

        <script>
          // JavaScript로 다크 모드 동적 전환 예시
          const lightSearchSelect = document.querySelector('[name="light-search"]');

          function toggleSearchDarkMode() {
            lightSearchSelect.dark = !lightSearchSelect.dark;
            console.log('검색 셀렉트 다크 모드:', lightSearchSelect.dark ? '활성화' : '비활성화');
          }

          // 다중 선택 다크 모드 초기값 설정
          const darkMultiSearch = document.querySelector('[name="dark-multi-search"]');
          darkMultiSearch.selectedValues = ['seoul', 'busan'];

          // 검색 테스트 예시:
          // - "사과" 또는 "ㅅㄱ" 입력하여 초성 검색 테스트
          // - "광역" 또는 "ㄱㅇ" 입력하여 여러 결과 검색 테스트
          // - 다크 모드에서 검색창 포커스 시 글로우 효과 확인
          console.log('다크 모드 검색 셀렉트 데모 준비 완료');
        </script>
      `,
      lang: 'html'
    }
  },
  en: {
  basic: {
    title: 'Basic Search Select Usage',
    description: `
      <code>seo-select-search</code> is an advanced select box with Korean initial consonant search functionality.

      - Includes all features of the basic <code>seo-select</code> with additional real-time search capabilities
      - Search input is fixed at the top of the dropdown and displayed above the option list
      - Supports Korean initial consonant search, allowing searches with consonants like <code>ㄱ</code>, <code>ㄴ</code>
      - Internally uses the <strong>getChosungAll</strong> utility function for accurate initial consonant matching
      - Option definition methods are identical to <code>seo-select</code> using slot or <strong>optionItems</strong> array
    `,
    code: `
      <!-- Defining options with slot method -->
      <seo-select-search name="brand" width="250px">
        <option value="kia">Kia Motors</option>
        <option value="hyundai" selected>Hyundai Motor</option>
        <option value="bmw">BMW</option>
        <option value="benz">Mercedes-Benz</option>
        <option value="audi">Audi</option>
        <option value="volkswagen">Volkswagen</option>
      </seo-select-search>

      <!-- Defining options with array method -->
      <seo-select-search id="dynamic-search" name="city" width="250px"></seo-select-search>

      <script>
        const searchSelect = document.getElementById('dynamic-search');
        searchSelect.optionItems = [
          { value: 'seoul', label: 'Seoul Metropolitan City' },
          { value: 'busan', label: 'Busan Metropolitan City' },
          { value: 'daegu', label: 'Daegu Metropolitan City' },
          { value: 'incheon', label: 'Incheon Metropolitan City' },
          { value: 'gwangju', label: 'Gwangju Metropolitan City' },
          { value: 'daejeon', label: 'Daejeon Metropolitan City' }
        ];
      </script>
    `,
    lang: 'html'
  },
  theme: {
    title: 'Theme System',
    description: `
      <code>seo-select-search</code> supports the same theme system as its parent class:

      - <strong>basic</strong>: Basic straight-edge style (no border radius)
      - <strong>float</strong>: Floating style with rounded corners and shadow effects (default)

      <strong>Float theme</strong> search functionality features:
      - Search input field has rounded top corners (5px border-radius)
      - Gradient glow effect applied when focusing on search input
      - Dropdown slides from top to bottom with animation
      - Overall smooth and modern user experience

      <strong>Basic theme</strong> search functionality features:
      - Traditional search input field with straight corners
      - No shadow or animation effects
      - Immediately appearing dropdown for quick responsiveness

      **Note**: Focus effects for the search input field are only applied in the float theme.
    `,
    code: `
      <!-- Float theme (default) - with search functionality -->
      <seo-select-search name="search-float" theme="float" width="250px">
        <option value="js">JavaScript</option>
        <option value="ts">TypeScript</option>
        <option value="react">React</option>
        <option value="vue">Vue.js</option>
        <option value="angular">Angular</option>
        <option value="svelte">Svelte</option>
      </seo-select-search>

      <!-- Basic theme - with search functionality -->
      <seo-select-search name="search-basic" theme="basic" width="250px">
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="go">Go</option>
        <option value="rust">Rust</option>
        <option value="php">PHP</option>
        <option value="ruby">Ruby</option>
      </seo-select-search>

      <script>
        // Try opening the dropdown and searching:
        // Float theme: Search "script", "ㅅㅋㄹㅍㅌ" etc. for smooth effects
        // Basic theme: Same search functionality but with immediate classic feel
        console.log('Theme-based search functionality demo ready');
      </script>
    `,
    lang: 'html'
  },
  search: {
    title: 'Initial Consonant Search Functionality',
    description: `
      The core feature of <code>seo-select-search</code> - initial consonant search - provides efficient filtering of Korean text.

      - **Exact matching**: Entering <code>"Seoul"</code> searches "Seoul Metropolitan City"
      - **Partial matching**: Entering <code>"Metro"</code> searches "Seoul **Metro**politan City"
      - **Initial consonant search**: Entering <code>"ㅅㅇ"</code> searches "**Seoul** Metropolitan City"
      - **Mixed search**: Entering <code>"ㅅeoul"</code> searches "**Seoul** Metropolitan City"
      - All options are displayed when there's no search term, and "No data available" message is shown when no items match
      - Keyboard navigation works normally during search, allowing movement within filtered results
    `,
    code: `
      <seo-select-search name="search-demo" width="300px">
        <option value="seoul">Seoul Metropolitan City</option>
        <option value="busan">Busan Metropolitan City</option>
        <option value="daegu">Daegu Metropolitan City</option>
        <option value="incheon">Incheon Metropolitan City</option>
        <option value="gwangju">Gwangju Metropolitan City</option>
        <option value="daejeon">Daejeon Metropolitan City</option>
        <option value="ulsan">Ulsan Metropolitan City</option>
        <option value="sejong">Sejong Special Autonomous City</option>
        <option value="gyeonggi">Gyeonggi Province</option>
        <option value="gangwon">Gangwon Special Autonomous Province</option>
      </seo-select-search>

      <!-- Try opening the dropdown and searching:
          - "Seoul" → Matches Seoul Metropolitan City
          - "ㅅㅇ" → Matches Seoul Metropolitan City
          - "Metro" → Matches all metropolitan cities
          - "ㄱㅇ" → Matches Gwangju Metropolitan City, Gyeonggi Province -->
    `,
    lang: 'html'
  },
  loading: {
    title: 'Loading State and Async Processing',
    description: `
      <code>seo-select-search</code> has the same loading handling mechanism as its parent class.

      - Opening dropdown when there are no options automatically displays loading spinner
      - During loading, animated dots and "Loading options..." message are displayed below the search field
      - Loading state is immediately released when options are created via slot or <strong>optionItems</strong>
      - Search functionality becomes active after loading completes, and automatically filters if there's an existing search term
      - Useful when loading large datasets through async API calls
    `,
    code: `
      <!-- Starting from empty state for loading demo -->
      <seo-select-search id="loading-demo" name="async-data" width="300px">
        <!-- Initially empty, so opening dropdown shows loading -->
      </seo-select-search>

      <button onclick="loadData()">Start Loading Data</button>

      <script>
        function loadData() {
          const select = document.getElementById('loading-demo');

          // Simulation: API data loading completes after 2 seconds
          setTimeout(() => {
            select.optionItems = Array.from({ length: 50 }, (_, i) => ({
              value: \`item-\${i}\`,
              label: \`Dynamically Loaded Item \${i + 1}\`
            }));
            console.log('Data loading complete - Search functionality activated');
          }, 2000);
        }
      </script>
    `,
    lang: 'html'
  },
  virtual: {
    title: 'Virtual Scrolling and Large Dataset Search',
    description: `
      <code>seo-select-search</code> enables real-time search even with thousands of options.

      - Extends <strong>InteractiveVirtualSelect</strong> to integrate search functionality with virtual scrolling
      - Filters from entire dataset when search term is entered, then applies to virtual scroll
      - Performance is maintained even with many search results as only visible items are rendered
      - Filtering happens immediately when search term changes, with focus moving to first matching item
      - Optimized structure that ensures both memory efficiency and search speed
    `,
    code: `
      <seo-select-search id="large-search" name="large-dataset" width="350px"></seo-select-search>

      <script>
        const largeSelect = document.getElementById('large-search');

        // Create large dataset with 10,000 items
        largeSelect.optionItems = Array.from({ length: 10000 }, (_, i) => {
          const categories = ['Frontend', 'Backend', 'Database', 'Infrastructure', 'Security'];
          const category = categories[i % categories.length];
          return {
            value: \`item-\${i.toString().padStart(4, '0')}\`,
            label: \`[\${category}] Tech Stack \${i.toString().padStart(4, '0')}\`
          };
        });

        console.log('10,000 items loaded - Try searching!');

        // Search examples: "Frontend", "ㅍㄹㅌ", "Backend", "ㅂㅇㄷ" etc.
      </script>
    `,
    lang: 'html'
  },
  multiple: {
    title: 'Multiple Selection with Search Combination',
    description: `
      Search functionality becomes even more useful in multiple selection mode.

      - Already selected items are excluded from dropdown and don't appear in search results
      - When tags are removed, corresponding items return as searchable options
      - **"No data" state is displayed when all items are selected**
      - Search filter is maintained when selecting/deselecting while search term exists
      - Very efficient for quickly finding and selecting specific items from large option sets
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

        // Track selection/deselection with event listeners
        multiSearchSelect.addEventListener('onSelect', (e) => {
          console.log('Selected:', e.detail);
          console.log('All currently selected values:', multiSearchSelect.selectedValues);
        });

        multiSearchSelect.addEventListener('onDeselect', (e) => {
          console.log('Deselected:', e.detail);
        });

        // Search examples: "script", "ㅅㅋㄹㅍㅌ" etc. to search JavaScript/TypeScript
      </script>
    `,
    lang: 'html'
  },
  events: {
    title: 'Search-Related Event Handling',
    description: `
      <code>seo-select-search</code> can track search-related behaviors in addition to basic select events.

      - **onSelect**: Fired when option is selected after search (can check selected value along with search term)
      - **onDeselect**: Fired when tag is removed in multiple selection (search state is maintained)
      - **onReset**: Fired on reset (search term is also initialized)
      - **change**: Standard form event (fired on value change regardless of search)
      - Search term changes are handled internally and don't fire separate events
      - Search term is automatically initialized when dropdown closes
    `,
    code: `
      <seo-select-search id="event-demo" name="demo" width="250px">
        <option value="option1">First Option</option>
        <option value="option2">Second Option</option>
        <option value="option3">Third Option</option>
        <option value="option4">Fourth Option</option>
        <option value="option5">Fifth Option</option>
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
          logEvent(\`Selected: \${e.detail.label} (value: \${e.detail.value})\`);
        });

        searchSelect.addEventListener('onReset', (e) => {
          logEvent('Reset - Search term also initialized');
        });

        searchSelect.addEventListener('change', (e) => {
          logEvent(\`Form value changed: \${e.target.value}\`);
        });

        // Try searching and selecting: "First", "ㅊㅂ", "Option" etc.
      </script>
    `,
    lang: 'html'
  },
  form: {
    title: 'Form Integration and Validation',
    description: `
      <code>seo-select-search</code> also provides complete form compatibility.

      - Set with <strong>formAssociated = true</strong> for integration with standard HTML forms
      - Search functionality is just UI convenience; only selected values are submitted during form submission
      - <strong>required</strong> attribute can enforce mandatory input
      - In multiple selection mode, comma-separated values are also submitted as one field
      - Search terms are not included in form data; only actual selected values are submitted
    `,
    code: `
      <form id="search-form">
        <label>
          Residence Region (Required):
          <seo-select-search name="region" required width="200px">
            <option value="">Please select</option>
            <option value="seoul">Seoul Metropolitan City</option>
            <option value="busan">Busan Metropolitan City</option>
            <option value="daegu">Daegu Metropolitan City</option>
            <option value="incheon">Incheon Metropolitan City</option>
            <option value="gwangju">Gwangju Metropolitan City</option>
            <option value="daejeon">Daejeon Metropolitan City</option>
            <option value="ulsan">Ulsan Metropolitan City</option>
          </seo-select-search>
        </label>

        <label>
          Areas of Interest (Multiple Selection):
          <seo-select-search name="interests" multiple width="300px">
            <option value="frontend">Frontend Development</option>
            <option value="backend">Backend Development</option>
            <option value="mobile">Mobile App Development</option>
            <option value="ai">AI/Machine Learning</option>
            <option value="blockchain">Blockchain</option>
            <option value="devops">DevOps/Infrastructure</option>
            <option value="design">UI/UX Design</option>
            <option value="data">Data Analysis</option>
          </seo-select-search>
        </label>

        <button type="submit">Submit</button>
      </form>

      <script>
        document.getElementById('search-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);

          console.log('=== Form Submission Data ===');
          for (const [key, value] of formData.entries()) {
            console.log(\`\${key}: \${value}\`);
          }
        });
      </script>
    `,
    lang: 'html'
  },
  darkmode: {
    title: 'Dark Mode Support',
    description: `
      <code>seo-select-search</code> perfectly supports dark mode with the <strong>dark</strong> attribute.

      <strong>Search functionality and dark mode</strong>:
      - Search input field is also completely converted to dark theme
      - Search icon color is automatically adjusted to match dark mode
      - Focus effects for search input field are also applied with dark mode-specific styles
      - Initial consonant search result highlighting maintains readability in dark mode
      - Loading spinner and "No data" messages are also displayed in dark theme

      <strong>Dark mode search field characteristics</strong>:
      - Background: Dark gray (#2d3748)
      - Text: Light gray (#e2e8f0)
      - Placeholder: Medium gray (#718096)
      - Focus border: Blue tones (#63b3ed)
      - Search icon: Secondary text color (#a0aec0)

      **Note**: Like the basic select, dark mode can be dynamically changed with JavaScript,
      providing consistent dark theme across all search functionality states (input, focus, result display).
    `,
    code: `
      <!-- Light mode search select (default) -->
      <seo-select-search name="light-search" theme="float" width="250px">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cherry">Cherry</option>
        <option value="date">Date</option>
        <option value="elderberry">Elderberry</option>
      </seo-select-search>

      <!-- Dark mode search select -->
      <seo-select-search name="dark-search" theme="float" dark width="250px">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cherry">Cherry</option>
        <option value="date">Date</option>
        <option value="elderberry">Elderberry</option>
      </seo-select-search>

      <!-- Multiple selection + dark mode + search -->
      <seo-select-search multiple name="dark-multi-search" theme="float" dark width="350px">
        <option value="seoul">Seoul Metropolitan City</option>
        <option value="busan">Busan Metropolitan City</option>
        <option value="daegu">Daegu Metropolitan City</option>
        <option value="incheon">Incheon Metropolitan City</option>
        <option value="gwangju">Gwangju Metropolitan City</option>
        <option value="daejeon">Daejeon Metropolitan City</option>
        <option value="ulsan">Ulsan Metropolitan City</option>
        <option value="sejong">Sejong Special Autonomous City</option>
        <option value="gyeonggi">Gyeonggi Province</option>
        <option value="gangwon">Gangwon Special Autonomous Province</option>
      </seo-select-search>

      <!-- Basic theme dark mode search -->
      <seo-select-search name="basic-dark-search" theme="basic" dark width="250px">
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
        <option value="mobile">Mobile</option>
        <option value="ai">AI</option>
        <option value="devops">DevOps</option>
      </seo-select-search>

      <script>
        // Example of dynamic dark mode switching with JavaScript
        const lightSearchSelect = document.querySelector('[name="light-search"]');

        function toggleSearchDarkMode() {
          lightSearchSelect.dark = !lightSearchSelect.dark;
          console.log('Search select dark mode:', lightSearchSelect.dark ? 'enabled' : 'disabled');
        }

        // Set initial values for multiple selection dark mode
        const darkMultiSearch = document.querySelector('[name="dark-multi-search"]');
        darkMultiSearch.selectedValues = ['seoul', 'busan'];

        // Search test examples:
        // - Enter "apple" or "ㅅㄱ" to test initial consonant search
        // - Enter "Metro" or "ㄱㅇ" to test multiple result search
        // - Check glow effect when focusing search field in dark mode
        console.log('Dark mode search select demo ready');
      </script>
    `,
    lang: 'html'
  }
  },
  zh: {
  basic: {
    title: '搜索选择框基本用法',
    description: `
      <code>seo-select-search</code> 是一个带有韩语首字母搜索功能的高级选择框。

      - 包含基本 <code>seo-select</code> 的所有功能，并额外提供实时搜索功能
      - 搜索框固定在下拉菜单顶部，显示在选项列表上方
      - 支持韩语首字母搜索，可以使用 <code>ㄱ</code>、<code>ㄴ</code> 等辅音进行搜索
      - 内部使用 <strong>getChosungAll</strong> 工具函数进行精确的首字母匹配
      - 选项定义方式与 <code>seo-select</code> 相同，使用 slot 或 <strong>optionItems</strong> 数组
    `,
    code: `
      <!-- 使用 slot 方式定义选项 -->
      <seo-select-search name="brand" width="250px">
        <option value="kia">起亚汽车</option>
        <option value="hyundai" selected>现代汽车</option>
        <option value="bmw">BMW</option>
        <option value="benz">Mercedes-Benz</option>
        <option value="audi">Audi</option>
        <option value="volkswagen">Volkswagen</option>
      </seo-select-search>

      <!-- 使用数组方式定义选项 -->
      <seo-select-search id="dynamic-search" name="city" width="250px"></seo-select-search>

      <script>
        const searchSelect = document.getElementById('dynamic-search');
        searchSelect.optionItems = [
          { value: 'seoul', label: '首尔特别市' },
          { value: 'busan', label: '釜山广域市' },
          { value: 'daegu', label: '大邱广域市' },
          { value: 'incheon', label: '仁川广域市' },
          { value: 'gwangju', label: '光州广域市' },
          { value: 'daejeon', label: '大田广域市' }
        ];
      </script>
    `,
    lang: 'html'
  },
  theme: {
    title: '主题系统',
    description: `
      <code>seo-select-search</code> 支持与父类相同的主题系统：

      - <strong>basic</strong>：基本直角风格（无圆角）
      - <strong>float</strong>：带圆角和阴影效果的悬浮风格（默认）

      <strong>float 主题</strong>搜索功能特点：
      - 搜索输入框顶部圆角处理（5px border-radius）
      - 搜索输入框聚焦时应用渐变发光效果
      - 下拉菜单从上到下滑动动画
      - 整体流畅现代的用户体验

      <strong>basic 主题</strong>搜索功能特点：
      - 传统直角搜索输入框
      - 无阴影或动画效果
      - 立即显示的下拉菜单，响应快速

      **注意**：搜索输入框的聚焦效果仅在 float 主题中应用。
    `,
    code: `
      <!-- Float 主题（默认）- 包含搜索功能 -->
      <seo-select-search name="search-float" theme="float" width="250px">
        <option value="js">JavaScript</option>
        <option value="ts">TypeScript</option>
        <option value="react">React</option>
        <option value="vue">Vue.js</option>
        <option value="angular">Angular</option>
        <option value="svelte">Svelte</option>
      </seo-select-search>

      <!-- Basic 主题 - 包含搜索功能 -->
      <seo-select-search name="search-basic" theme="basic" width="250px">
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="go">Go</option>
        <option value="rust">Rust</option>
        <option value="php">PHP</option>
        <option value="ruby">Ruby</option>
      </seo-select-search>

      <script>
        // 尝试打开下拉菜单并搜索：
        // Float 主题：搜索 "script"、"ㅅㅋㄹㅍㅌ" 等，体验流畅效果
        // Basic 主题：相同的搜索功能，但具有即时的经典感觉
        console.log('基于主题的搜索功能演示准备就绪');
      </script>
    `,
    lang: 'html'
  },
  search: {
    title: '首字母搜索功能',
    description: `
      <code>seo-select-search</code> 的核心功能 - 首字母搜索 - 提供韩语文本的高效过滤。

      - **完全匹配**：输入 <code>"首尔"</code> 搜索 "首尔特别市"
      - **部分匹配**：输入 <code>"特别"</code> 搜索 "首尔**特别**市"
      - **首字母搜索**：输入 <code>"ㅅㅇ"</code> 搜索 "**首尔**特别市"
      - **混合搜索**：输入 <code>"ㅅ울시"</code> 搜索 "**首尔**特别**市**"
      - 无搜索词时显示所有选项，无匹配项时显示"暂无数据"消息
      - 搜索期间键盘导航正常工作，可在过滤结果内移动
    `,
    code: `
      <seo-select-search name="search-demo" width="300px">
        <option value="seoul">首尔特别市</option>
        <option value="busan">釜山广域市</option>
        <option value="daegu">大邱广域市</option>
        <option value="incheon">仁川广域市</option>
        <option value="gwangju">光州广域市</option>
        <option value="daejeon">大田广域市</option>
        <option value="ulsan">蔚山广域市</option>
        <option value="sejong">世宗特别自治市</option>
        <option value="gyeonggi">京畿道</option>
        <option value="gangwon">江原特别自治道</option>
      </seo-select-search>

      <!-- 尝试打开下拉菜单并搜索：
          - "首尔" → 匹配首尔特别市
          - "ㅅㅇ" → 匹配首尔特别市
          - "广域" → 匹配所有广域市
          - "ㄱㅇ" → 匹配光州广域市、京畿道 -->
    `,
    lang: 'html'
  },
  loading: {
    title: '加载状态与异步处理',
    description: `
      <code>seo-select-search</code> 具有与父类相同的加载处理机制。

      - 无选项时打开下拉菜单会自动显示加载旋转器
      - 加载期间，搜索框下方显示动画点和"正在加载选项..."消息
      - 通过 slot 或 <strong>optionItems</strong> 创建选项后立即释放加载状态
      - 加载完成后激活搜索功能，如果存在现有搜索词则自动过滤
      - 通过异步 API 调用加载大型数据集时非常有用
    `,
    code: `
      <!-- 从空状态开始的加载演示 -->
      <seo-select-search id="loading-demo" name="async-data" width="300px">
        <!-- 初始为空，打开下拉菜单显示加载 -->
      </seo-select-search>

      <button onclick="loadData()">开始加载数据</button>

      <script>
        function loadData() {
          const select = document.getElementById('loading-demo');

          // 模拟：2秒后 API 数据加载完成
          setTimeout(() => {
            select.optionItems = Array.from({ length: 50 }, (_, i) => ({
              value: \`item-\${i}\`,
              label: \`动态加载项目 \${i + 1}\`
            }));
            console.log('数据加载完成 - 搜索功能已激活');
          }, 2000);
        }
      </script>
    `,
    lang: 'html'
  },
  virtual: {
    title: '虚拟滚动与大数据集搜索',
    description: `
      <code>seo-select-search</code> 即使在数千个选项中也能实现实时搜索。

      - 扩展 <strong>InteractiveVirtualSelect</strong> 以集成搜索功能和虚拟滚动
      - 输入搜索词时从整个数据集中过滤，然后应用到虚拟滚动
      - 即使搜索结果很多，由于只渲染可见项目，性能得以保持
      - 搜索词更改时立即过滤，焦点移动到第一个匹配项
      - 优化的结构确保内存效率和搜索速度
    `,
    code: `
      <seo-select-search id="large-search" name="large-dataset" width="350px"></seo-select-search>

      <script>
        const largeSelect = document.getElementById('large-search');

        // 创建 10,000 项的大数据集
        largeSelect.optionItems = Array.from({ length: 10000 }, (_, i) => {
          const categories = ['前端', '后端', '数据库', '基础设施', '安全'];
          const category = categories[i % categories.length];
          return {
            value: \`item-\${i.toString().padStart(4, '0')}\`,
            label: \`[\${category}] 技术栈 \${i.toString().padStart(4, '0')}\`
          };
        });

        console.log('10,000 项已加载 - 试试搜索！');

        // 搜索示例："前端"、"ㅍㄹㅌ"、"后端"、"ㅂㅇㄷ" 等
      </script>
    `,
    lang: 'html'
  },
  multiple: {
    title: '多选与搜索组合',
    description: `
      在多选模式下，搜索功能变得更加有用。

      - 已选择的项目从下拉菜单中排除，不会出现在搜索结果中
      - 移除标签时，相应项目重新作为可搜索选项返回
      - **选择所有项目时显示"暂无数据"状态**
      - 存在搜索词时选择/取消选择会保持搜索过滤器
      - 从大型选项集中快速查找和选择特定项目时非常高效
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

        // 使用事件监听器跟踪选择/取消选择
        multiSearchSelect.addEventListener('onSelect', (e) => {
          console.log('已选择：', e.detail);
          console.log('当前所有选择值：', multiSearchSelect.selectedValues);
        });

        multiSearchSelect.addEventListener('onDeselect', (e) => {
          console.log('已取消选择：', e.detail);
        });

        // 搜索示例："script"、"ㅅㅋㄹㅍㅌ" 等搜索 JavaScript/TypeScript
      </script>
    `,
    lang: 'html'
  },
  events: {
    title: '搜索相关事件处理',
    description: `
      <code>seo-select-search</code> 除基本选择事件外，还可以跟踪搜索相关行为。

      - **onSelect**：搜索后选择选项时触发（可检查选择值和搜索词）
      - **onDeselect**：多选中移除标签时触发（保持搜索状态）
      - **onReset**：重置时触发（搜索词也会初始化）
      - **change**：标准表单事件（无论搜索如何，值更改时触发）
      - 搜索词更改在内部处理，不触发单独事件
      - 下拉菜单关闭时搜索词自动初始化
    `,
    code: `
      <seo-select-search id="event-demo" name="demo" width="250px">
        <option value="option1">第一个选项</option>
        <option value="option2">第二个选项</option>
        <option value="option3">第三个选项</option>
        <option value="option4">第四个选项</option>
        <option value="option5">第五个选项</option>
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
          logEvent(\`选择：\${e.detail.label}（值：\${e.detail.value}）\`);
        });

        searchSelect.addEventListener('onReset', (e) => {
          logEvent('重置 - 搜索词也已初始化');
        });

        searchSelect.addEventListener('change', (e) => {
          logEvent(\`表单值更改：\${e.target.value}\`);
        });

        // 尝试搜索和选择："第一"、"ㅊㅂ"、"选项" 等
      </script>
    `,
    lang: 'html'
  },
  form: {
    title: '表单集成与验证',
    description: `
      <code>seo-select-search</code> 也提供完整的表单兼容性。

      - 设置 <strong>formAssociated = true</strong> 以与标准 HTML 表单集成
      - 搜索功能只是 UI 便利性；表单提交时只提交选择的值
      - <strong>required</strong> 属性可以强制必填输入
      - 多选模式下，逗号分隔的值也作为一个字段提交
      - 搜索词不包含在表单数据中；只提交实际选择的值
    `,
    code: `
      <form id="search-form">
        <label>
          居住地区（必填）：
          <seo-select-search name="region" required width="200px">
            <option value="">请选择</option>
            <option value="seoul">首尔特别市</option>
            <option value="busan">釜山广域市</option>
            <option value="daegu">大邱广域市</option>
            <option value="incheon">仁川广域市</option>
            <option value="gwangju">光州广域市</option>
            <option value="daejeon">大田广域市</option>
            <option value="ulsan">蔚山广域市</option>
          </seo-select-search>
        </label>

        <label>
          兴趣领域（多选）：
          <seo-select-search name="interests" multiple width="300px">
            <option value="frontend">前端开发</option>
            <option value="backend">后端开发</option>
            <option value="mobile">移动应用开发</option>
            <option value="ai">人工智能/机器学习</option>
            <option value="blockchain">区块链</option>
            <option value="devops">DevOps/基础设施</option>
            <option value="design">UI/UX 设计</option>
            <option value="data">数据分析</option>
          </seo-select-search>
        </label>

        <button type="submit">提交</button>
      </form>

      <script>
        document.getElementById('search-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);

          console.log('=== 表单提交数据 ===');
          for (const [key, value] of formData.entries()) {
            console.log(\`\${key}: \${value}\`);
          }
        });
      </script>
    `,
    lang: 'html'
  },
  darkmode: {
    title: '暗黑模式支持',
    description: `
      <code>seo-select-search</code> 通过 <strong>dark</strong> 属性完美支持暗黑模式。

      <strong>搜索功能与暗黑模式</strong>：
      - 搜索输入框也完全转换为暗黑主题
      - 搜索图标颜色自动调整以匹配暗黑模式
      - 搜索输入框的焦点效果也应用暗黑模式专用样式
      - 首字母搜索结果高亮在暗黑模式下保持可读性
      - 加载旋转器和"暂无数据"消息也以暗黑主题显示

      <strong>暗黑模式搜索框特征</strong>：
      - 背景：深灰色 (#2d3748)
      - 文本：浅灰色 (#e2e8f0)
      - 占位符：中等灰色 (#718096)
      - 焦点边框：蓝色调 (#63b3ed)
      - 搜索图标：次要文本颜色 (#a0aec0)

      **注意**：与基本选择框一样，暗黑模式可以通过 JavaScript 动态更改，
      在所有搜索功能状态（输入、焦点、结果显示）中提供一致的暗黑主题。
    `,
    code: `
      <!-- 浅色模式搜索选择框（默认） -->
      <seo-select-search name="light-search" theme="float" width="250px">
        <option value="apple">苹果</option>
        <option value="banana">香蕉</option>
        <option value="cherry">樱桃</option>
        <option value="date">枣子</option>
        <option value="elderberry">接骨木莓</option>
      </seo-select-search>

      <!-- 暗黑模式搜索选择框 -->
      <seo-select-search name="dark-search" theme="float" dark width="250px">
        <option value="apple">苹果</option>
        <option value="banana">香蕉</option>
        <option value="cherry">樱桃</option>
        <option value="date">枣子</option>
        <option value="elderberry">接骨木莓</option>
      </seo-select-search>

      <!-- 多选 + 暗黑模式 + 搜索 -->
      <seo-select-search multiple name="dark-multi-search" theme="float" dark width="350px">
        <option value="seoul">首尔特别市</option>
        <option value="busan">釜山广域市</option>
        <option value="daegu">大邱广域市</option>
        <option value="incheon">仁川广域市</option>
        <option value="gwangju">光州广域市</option>
        <option value="daejeon">大田广域市</option>
        <option value="ulsan">蔚山广域市</option>
        <option value="sejong">世宗特别自治市</option>
        <option value="gyeonggi">京畿道</option>
        <option value="gangwon">江原特别自治道</option>
      </seo-select-search>

      <!-- Basic 主题暗黑模式搜索 -->
      <seo-select-search name="basic-dark-search" theme="basic" dark width="250px">
        <option value="frontend">前端</option>
        <option value="backend">后端</option>
        <option value="mobile">移动端</option>
        <option value="ai">人工智能</option>
        <option value="devops">DevOps</option>
      </seo-select-search>

      <script>
        // JavaScript 动态暗黑模式切换示例
        const lightSearchSelect = document.querySelector('[name="light-search"]');

        function toggleSearchDarkMode() {
          lightSearchSelect.dark = !lightSearchSelect.dark;
          console.log('搜索选择框暗黑模式：', lightSearchSelect.dark ? '已启用' : '已禁用');
        }

        // 设置多选暗黑模式初始值
        const darkMultiSearch = document.querySelector('[name="dark-multi-search"]');
        darkMultiSearch.selectedValues = ['seoul', 'busan'];

        // 搜索测试示例：
        // - 输入 "苹果" 或 "ㅅㄱ" 测试首字母搜索
        // - 输入 "广域" 或 "ㄱㅇ" 测试多结果搜索
        // - 在暗黑模式下聚焦搜索框时检查发光效果
        console.log('暗黑模式搜索选择框演示准备就绪');
      </script>
    `,
    lang: 'html'
  }
  },
  ja: {
  basic: {
    title: '検索セレクトボックス基本使用法',
    description: `
      <code>seo-select-search</code>は韓国語の初声検索機能を含む高度なセレクトボックスです。

      - 基本の<code>seo-select</code>のすべての機能を含み、追加でリアルタイム検索機能を提供します
      - 検索ボックスはドロップダウンの上部に固定され、オプションリストの上に表示されます
      - 韓国語の初声検索をサポートし、<code>ㄱ</code>、<code>ㄴ</code>などの子音でも検索できます
      - <strong>getChosungAll</strong>ユーティリティ関数を内部的に使用して正確な初声マッチングを実行します
      - オプション定義方法は<code>seo-select</code>と同様にslotまたは<strong>optionItems</strong>配列を使用します
    `,
    code: `
      <!-- slot方式でオプション定義 -->
      <seo-select-search name="brand" width="250px">
        <option value="kia">起亜自動車</option>
        <option value="hyundai" selected>現代自動車</option>
        <option value="bmw">BMW</option>
        <option value="benz">Mercedes-Benz</option>
        <option value="audi">Audi</option>
        <option value="volkswagen">Volkswagen</option>
      </seo-select-search>

      <!-- 配列方式でオプション定義 -->
      <seo-select-search id="dynamic-search" name="city" width="250px"></seo-select-search>

      <script>
        const searchSelect = document.getElementById('dynamic-search');
        searchSelect.optionItems = [
          { value: 'seoul', label: 'ソウル特別市' },
          { value: 'busan', label: '釜山広域市' },
          { value: 'daegu', label: '大邱広域市' },
          { value: 'incheon', label: '仁川広域市' },
          { value: 'gwangju', label: '光州広域市' },
          { value: 'daejeon', label: '大田広域市' }
        ];
      </script>
    `,
    lang: 'html'
  },
  theme: {
    title: 'テーマシステム',
    description: `
      <code>seo-select-search</code>は親クラスと同じテーマシステムをサポートします：

      - <strong>basic</strong>：基本的な直角スタイル（境界半径なし）
      - <strong>float</strong>：丸い角と影のあるフローティングスタイル（デフォルト）

      <strong>floatテーマ</strong>の検索機能特徴：
      - 検索入力フィールドの上部角が丸く処理される（5px border-radius）
      - 検索入力にフォーカス時にグラデーショングロー効果適用
      - ドロップダウンが上から下にスライドするアニメーション
      - 全体的に滑らかでモダンなユーザー体験

      <strong>basicテーマ</strong>の検索機能特徴：
      - 伝統的な直角の検索入力フィールド
      - 影やアニメーション効果なし
      - 即座に表示されるドロップダウンで高速応答性

      **注意**：検索入力フィールドのフォーカス効果はfloatテーマでのみ適用されます。
    `,
    code: `
      <!-- Floatテーマ（デフォルト）- 検索機能付き -->
      <seo-select-search name="search-float" theme="float" width="250px">
        <option value="js">JavaScript</option>
        <option value="ts">TypeScript</option>
        <option value="react">React</option>
        <option value="vue">Vue.js</option>
        <option value="angular">Angular</option>
        <option value="svelte">Svelte</option>
      </seo-select-search>

      <!-- Basicテーマ - 検索機能付き -->
      <seo-select-search name="search-basic" theme="basic" width="250px">
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="go">Go</option>
        <option value="rust">Rust</option>
        <option value="php">PHP</option>
        <option value="ruby">Ruby</option>
      </seo-select-search>

      <script>
        // ドロップダウンを開いて検索してみてください：
        // Floatテーマ："script"、"ㅅㅋㄹㅍㅌ"などで検索して滑らかな効果を体験
        // Basicテーマ：同じ検索機能ですが即座に反応するクラシックな感覚
        console.log('テーマベース検索機能デモ準備完了');
      </script>
    `,
    lang: 'html'
  },
  search: {
    title: '初声検索機能',
    description: `
      <code>seo-select-search</code>のコア機能である初声検索は、韓国語テキストの効率的なフィルタリングを提供します。

      - **完全マッチング**：<code>"ソウル"</code>入力時「ソウル特別市」検索
      - **部分マッチング**：<code>"特別"</code>入力時「ソウル**特別**市」検索
      - **初声検索**：<code>"ㅅㅇ"</code>入力時「**ソウル**特別市」検索
      - **混合検索**：<code>"ㅅウル市"</code>入力時「**ソウル**特別**市**」検索
      - 検索語がない場合はすべてのオプションが表示され、マッチする項目がない場合は「データがありません」メッセージが表示されます
      - 検索中でもキーボードナビゲーションが正常に動作し、フィルタされた結果内で移動できます
    `,
    code: `
      <seo-select-search name="search-demo" width="300px">
        <option value="seoul">ソウル特別市</option>
        <option value="busan">釜山広域市</option>
        <option value="daegu">大邱広域市</option>
        <option value="incheon">仁川広域市</option>
        <option value="gwangju">光州広域市</option>
        <option value="daejeon">大田広域市</option>
        <option value="ulsan">蔚山広域市</option>
        <option value="sejong">世宗特別自治市</option>
        <option value="gyeonggi">京畿道</option>
        <option value="gangwon">江原特別自治道</option>
      </seo-select-search>

      <!-- ドロップダウンを開いて以下のように検索してみてください：
          - "ソウル" → ソウル特別市マッチ
          - "ㅅㅇ" → ソウル特別市マッチ
          - "広域" → すべての広域市マッチ
          - "ㄱㅇ" → 光州広域市、京畿道マッチ -->
    `,
    lang: 'html'
  },
  loading: {
    title: 'ローディング状態と非同期処理',
    description: `
      <code>seo-select-search</code>は親クラスと同じローディング処理メカニズムを持ちます。

      - オプションがない状態でドロップダウンを開くと自動的にローディングスピナーが表示されます
      - ローディング中は検索ボックス下にアニメーションドットと「オプション読み込み中...」メッセージが表示されます
      - slotまたは<strong>optionItems</strong>でオプションが作成されると即座にローディング状態が解除されます
      - ローディング完了後に検索機能が有効になり、既存の検索語があれば自動的にフィルタリングされます
      - 非同期API呼び出しなどで大量データを読み込む際に有用です
    `,
    code: `
      <!-- 空の状態から始まるローディングデモ -->
      <seo-select-search id="loading-demo" name="async-data" width="300px">
        <!-- 最初は空なのでドロップダウンを開くとローディング表示 -->
      </seo-select-search>

      <button onclick="loadData()">データ読み込み開始</button>

      <script>
        function loadData() {
          const select = document.getElementById('loading-demo');

          // シミュレーション：2秒後APIデータ読み込み完了
          setTimeout(() => {
            select.optionItems = Array.from({ length: 50 }, (_, i) => ({
              value: \`item-\${i}\`,
              label: \`動的読み込み項目 \${i + 1}\`
            }));
            console.log('データ読み込み完了 - 検索機能有効化');
          }, 2000);
        }
      </script>
    `,
    lang: 'html'
  },
  virtual: {
    title: '仮想スクロールと大量データ検索',
    description: `
      <code>seo-select-search</code>は数千のオプションでもリアルタイム検索が可能です。

      - <strong>InteractiveVirtualSelect</strong>を拡張して検索機能と仮想スクロールを統合
      - 検索語入力時に全データセットからフィルタリング後、仮想スクロールに適用
      - 検索結果が多くても可視領域の項目のみレンダリングされるためパフォーマンスが維持されます
      - 検索語変更時に即座にフィルタリングされ、最初のマッチング項目にフォーカスが移動します
      - メモリ効率と検索速度の両方を保証する最適化された構造
    `,
    code: `
      <seo-select-search id="large-search" name="large-dataset" width="350px"></seo-select-search>

      <script>
        const largeSelect = document.getElementById('large-search');

        // 10,000項目で大量データセット作成
        largeSelect.optionItems = Array.from({ length: 10000 }, (_, i) => {
          const categories = ['フロントエンド', 'バックエンド', 'データベース', 'インフラ', 'セキュリティ'];
          const category = categories[i % categories.length];
          return {
            value: \`item-\${i.toString().padStart(4, '0')}\`,
            label: \`[\${category}] 技術スタック \${i.toString().padStart(4, '0')}\`
          };
        });

        console.log('10,000項目読み込み完了 - 検索してみてください！');

        // 検索例："フロント"、"ㅍㄹㅌ"、"バック"、"ㅂㅇㄷ"などで検索可能
      </script>
    `,
    lang: 'html'
  },
  multiple: {
    title: '複数選択と検索の組み合わせ',
    description: `
      複数選択モードでは検索機能がさらに有用になります。

      - すでに選択された項目はドロップダウンから除外され、検索結果に表示されません
      - タグ削除時に該当項目が再び検索可能なオプションとして復帰します
      - **すべての項目を選択すると「データなし」状態が表示されます**
      - 検索語がある状態で選択/解除時も検索フィルターが維持されます
      - 大量オプションから特定項目を素早く見つけて選択する際に非常に効率的です
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

        // イベントリスナーで選択/解除を追跡
        multiSearchSelect.addEventListener('onSelect', (e) => {
          console.log('選択：', e.detail);
          console.log('現在のすべての選択値：', multiSearchSelect.selectedValues);
        });

        multiSearchSelect.addEventListener('onDeselect', (e) => {
          console.log('解除：', e.detail);
        });

        // 検索例："script"、"ㅅㅋㄹㅍㅌ"などでJavaScript/TypeScript検索
      </script>
    `,
    lang: 'html'
  },
  events: {
    title: '検索関連イベント処理',
    description: `
      <code>seo-select-search</code>は基本セレクトイベントに加えて検索関連動作も追跡できます。

      - **onSelect**：検索後オプション選択時に発生（検索語と共に選択された値を確認可能）
      - **onDeselect**：複数選択でタグ削除時に発生（検索状態維持）
      - **onReset**：リセット時に発生（検索語も共に初期化）
      - **change**：標準フォームイベント（検索に関係なく値変更時に発生）
      - 検索語変更自体は内部的に処理され、別個のイベントを発生させません
      - ドロップダウン閉じる時に検索語が自動的に初期化されます
    `,
    code: `
      <seo-select-search id="event-demo" name="demo" width="250px">
        <option value="option1">最初のオプション</option>
        <option value="option2">2番目のオプション</option>
        <option value="option3">3番目のオプション</option>
        <option value="option4">4番目のオプション</option>
        <option value="option5">5番目のオプション</option>
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
          logEvent(\`選択：\${e.detail.label}（値：\${e.detail.value}）\`);
        });

        searchSelect.addEventListener('onReset', (e) => {
          logEvent('リセット - 検索語も初期化');
        });

        searchSelect.addEventListener('change', (e) => {
          logEvent(\`フォーム値変更：\${e.target.value}\`);
        });

        // 検索して選択してみてください："最初"、"ㅊㅂ"、"オプション"など
      </script>
    `,
    lang: 'html'
  },
  form: {
    title: 'フォーム連携と検証',
    description: `
      <code>seo-select-search</code>も完全なフォーム互換性を提供します。

      - <strong>formAssociated = true</strong>で設定され標準HTMLフォームと連携
      - 検索機能はUI便利性のみ；フォーム送信時は選択された値のみ送信されます
      - <strong>required</strong>属性で必須入力を強制できます
      - 複数選択時もカンマ区切りの値が一つのフィールドとして送信されます
      - 検索語はフォームデータに含まれず、選択された実際の値のみ送信されます
    `,
    code: `
      <form id="search-form">
        <label>
          居住地域（必須）：
          <seo-select-search name="region" required width="200px">
            <option value="">選択してください</option>
            <option value="seoul">ソウル特別市</option>
            <option value="busan">釜山広域市</option>
            <option value="daegu">大邱広域市</option>
            <option value="incheon">仁川広域市</option>
            <option value="gwangju">光州広域市</option>
            <option value="daejeon">大田広域市</option>
            <option value="ulsan">蔚山広域市</option>
          </seo-select-search>
        </label>

        <label>
          関心分野（複数選択）：
          <seo-select-search name="interests" multiple width="300px">
            <option value="frontend">フロントエンド開発</option>
            <option value="backend">バックエンド開発</option>
            <option value="mobile">モバイルアプリ開発</option>
            <option value="ai">人工知能/機械学習</option>
            <option value="blockchain">ブロックチェーン</option>
            <option value="devops">DevOps/インフラ</option>
            <option value="design">UI/UXデザイン</option>
            <option value="data">データ分析</option>
          </seo-select-search>
        </label>

        <button type="submit">送信</button>
      </form>

      <script>
        document.getElementById('search-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);

          console.log('=== フォーム送信データ ===');
          for (const [key, value] of formData.entries()) {
            console.log(\`\${key}: \${value}\`);
          }
        });
      </script>
    `,
    lang: 'html'
  },
  darkmode: {
    title: 'ダークモード対応',
    description: `
      <code>seo-select-search</code>は<strong>dark</strong>属性でダークモードを完璧にサポートします。

      <strong>検索機能とダークモード</strong>：
      - 検索入力ボックスもダークテーマに完全変換されます
      - 検索アイコンカラーがダークモードに合わせて自動調整されます
      - 検索入力フィールドのフォーカス効果もダークモード専用スタイルで適用されます
      - 初声検索結果のハイライトもダークモードで可読性を維持します
      - ローディングスピナーと「データなし」メッセージもダークテーマで表示されます

      <strong>ダークモード検索ボックス特徴</strong>：
      - 背景：ダークグレー（#2d3748）
      - テキスト：ライトグレー（#e2e8f0）
      - プレースホルダー：ミディアムグレー（#718096）
      - フォーカス境界：ブルー系（#63b3ed）
      - 検索アイコン：補助テキストカラー（#a0aec0）

      **注意**：ダークモードは基本セレクトと同様にJavaScriptで動的変更が可能で、
      検索機能のすべての状態（入力、フォーカス、結果表示）で一貫したダークテーマを提供します。
    `,
    code: `
      <!-- ライトモード検索セレクト（デフォルト） -->
      <seo-select-search name="light-search" theme="float" width="250px">
        <option value="apple">りんご</option>
        <option value="banana">バナナ</option>
        <option value="cherry">チェリー</option>
        <option value="date">デーツ</option>
        <option value="elderberry">エルダーベリー</option>
      </seo-select-search>

      <!-- ダークモード検索セレクト -->
      <seo-select-search name="dark-search" theme="float" dark width="250px">
        <option value="apple">りんご</option>
        <option value="banana">バナナ</option>
        <option value="cherry">チェリー</option>
        <option value="date">デーツ</option>
        <option value="elderberry">エルダーベリー</option>
      </seo-select-search>

      <!-- 複数選択 + ダークモード + 検索 -->
      <seo-select-search multiple name="dark-multi-search" theme="float" dark width="350px">
        <option value="seoul">ソウル特別市</option>
        <option value="busan">釜山広域市</option>
        <option value="daegu">大邱広域市</option>
        <option value="incheon">仁川広域市</option>
        <option value="gwangju">光州広域市</option>
        <option value="daejeon">大田広域市</option>
        <option value="ulsan">蔚山広域市</option>
        <option value="sejong">世宗特別自治市</option>
        <option value="gyeonggi">京畿道</option>
        <option value="gangwon">江原特別自治道</option>
      </seo-select-search>

      <!-- Basicテーマダークモード検索 -->
      <seo-select-search name="basic-dark-search" theme="basic" dark width="250px">
        <option value="frontend">フロントエンド</option>
        <option value="backend">バックエンド</option>
        <option value="mobile">モバイル</option>
        <option value="ai">人工知能</option>
        <option value="devops">DevOps</option>
      </seo-select-search>

      <script>
        // JavaScriptでダークモード動的切り替え例
        const lightSearchSelect = document.querySelector('[name="light-search"]');

        function toggleSearchDarkMode() {
          lightSearchSelect.dark = !lightSearchSelect.dark;
          console.log('検索セレクトダークモード：', lightSearchSelect.dark ? '有効' : '無効');
        }

        // 複数選択ダークモード初期値設定
        const darkMultiSearch = document.querySelector('[name="dark-multi-search"]');
        darkMultiSearch.selectedValues = ['seoul', 'busan'];

        // 検索テスト例：
        // - "りんご"または"ㅅㄱ"を入力して初声検索テスト
        // - "広域"または"ㄱㅇ"を入力して複数結果検索テスト
        // - ダークモードで検索ボックスフォーカス時のグロー効果確認
        console.log('ダークモード検索セレクトデモ準備完了');
      </script>
    `,
    lang: 'html'
  }
  }
};