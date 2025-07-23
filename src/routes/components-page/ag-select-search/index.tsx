import { component$, $, useVisibleTask$ } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { docs } from './docs';
import './style.scss';

interface CustomSelectSearchElement extends HTMLElement {
  optionItems?: { value: string; label: string }[];
  value?: string;
  selectedValues?: string[];
  multiple?: boolean;
  showReset?: boolean;
  resetToDefaultValue?: () => void;
  _searchText?: string;
}

export default component$(() => {
  useVisibleTask$(() => {
    import('@/components/ag-select-search').then((mod) => {
      if (!customElements.get('ag-select-search')) {
        customElements.define('ag-select-search', mod.AgSelectSearch);
      }

      // 대용량 검색 데모 설정
      const largeSearchSelect = document.getElementById('large-search') as CustomSelectSearchElement;
      if (largeSearchSelect) {
        const categories = ['프론트엔드', '백엔드', '데이터베이스', '인프라', '보안', '모바일', 'AI/ML', '디자인'];
        largeSearchSelect.optionItems = Array.from({ length: 10000 }, (_, i) => {
          const category = categories[i % categories.length];
          return {
            value: `item-${i.toString().padStart(4, '0')}`,
            label: `[${category}] 기술 스택 ${i.toString().padStart(4, '0')} - 상세 설명`
          };
        });
      }

      // 동적 검색 데모 설정
      const dynamicSearchSelect = document.getElementById('dynamic-search') as CustomSelectSearchElement;
      if (dynamicSearchSelect) {
        dynamicSearchSelect.optionItems = [
          { value: 'seoul', label: '서울특별시' },
          { value: 'busan', label: '부산광역시' },
          { value: 'daegu', label: '대구광역시' },
          { value: 'incheon', label: '인천광역시' },
          { value: 'gwangju', label: '광주광역시' },
          { value: 'daejeon', label: '대전광역시' },
          { value: 'ulsan', label: '울산광역시' },
          { value: 'sejong', label: '세종특별자치시' },
          { value: 'gyeonggi', label: '경기도' },
          { value: 'gangwon', label: '강원특별자치도' },
          { value: 'chungbuk', label: '충청북도' },
          { value: 'chungnam', label: '충청남도' },
          { value: 'jeonbuk', label: '전북특별자치도' },
          { value: 'jeonnam', label: '전라남도' },
          { value: 'gyeongbuk', label: '경상북도' },
          { value: 'gyeongnam', label: '경상남도' },
          { value: 'jeju', label: '제주특별자치도' }
        ];
      }

      // 로딩 데모는 빈 상태로 유지
      const loadingSearchSelect = document.getElementById('loading-search-demo') as CustomSelectSearchElement;
      // 의도적으로 비어둠 - 드롭다운 열 때마다 로딩 상태 표시

      // 다중 선택 검색 데모 설정
      const multiSearchSelect = document.getElementById('multi-search-demo') as CustomSelectSearchElement;
      if (multiSearchSelect) {
        // 이벤트 리스너 등록
        multiSearchSelect.addEventListener('onSelect', (e: Event) => {
          const { value, label } = (e as CustomEvent).detail;
          const log = document.getElementById('multi-event-log');
          if (log) {
            log.innerHTML += `<div>선택됨: ${value} (${label})</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });

        multiSearchSelect.addEventListener('onDeselect', (e: Event) => {
          const { value, label } = (e as CustomEvent).detail;
          const log = document.getElementById('multi-event-log');
          if (log) {
            log.innerHTML += `<div class="deselect">해제됨: ${value} (${label})</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });

        multiSearchSelect.addEventListener('onReset', (e: Event) => {
          const log = document.getElementById('multi-event-log');
          if (log) {
            log.innerHTML += `<div class="reset">리셋됨 - 검색어도 초기화</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });
      }

      // 이벤트 데모 설정
      const eventSearchSelect = document.getElementById('event-search-demo') as CustomSelectSearchElement;
      if (eventSearchSelect) {
        eventSearchSelect.addEventListener('onSelect', (e: Event) => {
          const { value, label } = (e as CustomEvent).detail;
          const log = document.getElementById('search-event-log');
          if (log) {
            const time = new Date().toLocaleTimeString();
            log.innerHTML += `<div>[${time}] 선택: ${label} (값: ${value})</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });

        eventSearchSelect.addEventListener('onReset', (e: Event) => {
          const log = document.getElementById('search-event-log');
          if (log) {
            const time = new Date().toLocaleTimeString();
            log.innerHTML += `<div class="reset">[${time}] 리셋됨 - 검색어도 초기화</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });

        eventSearchSelect.addEventListener('change', (e: Event) => {
          const log = document.getElementById('search-event-log');
          if (log) {
            const time = new Date().toLocaleTimeString();
            log.innerHTML += `<div>[${time}] 폼 값 변경: ${(e.target as HTMLElement).getAttribute('value')}</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });
      }
    });
  });

  const handleFormSubmit = $((ev: SubmitEvent) => {
    ev.preventDefault();

    const form = ev.target as HTMLFormElement;
    const formData = new FormData(form);

    let result = '=== 폼 제출 데이터 ===\n';
    for (const [key, value] of formData.entries()) {
      result += `${key}: ${value}\n`;
    }

    const output = form.querySelector('.form-output') as HTMLElement;
    if (output) {
      output.textContent = result || '(폼 데이터 없음)';
    }
  });

  const clearEventLog = $(async (logId: string) => {
    const log = document.getElementById(logId);
    if (log) log.innerHTML = '';
  });

  const triggerAsyncLoading = $(() => {
    const loadingSelect = document.getElementById('async-loading-demo') as CustomSelectSearchElement;
    if (loadingSelect) {
      // 먼저 옵션을 빈 배열로 설정하여 로딩 상태 유도
      loadingSelect.optionItems = [];
      
      // 2초 후 새로운 옵션들로 로딩 완료
      setTimeout(() => {
        const techStack = [
          'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby',
          'Node.js', 'Express', 'Fastify', 'NestJS', 'Koa', 'Hapi',
          'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
          'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform'
        ];
        
        loadingSelect.optionItems = techStack.map((tech, i) => ({
          value: `tech-${i}`,
          label: `${tech} - 동적 로딩된 기술`
        }));
        
        console.log('검색 가능한 기술 스택 로딩 완료!');
      }, 2000);
    }
  });

  const resetAsyncDemo = $(() => {
    const loadingSelect = document.getElementById('async-loading-demo') as CustomSelectSearchElement;
    if (loadingSelect) {
      loadingSelect.optionItems = [
        { value: 'initial', label: '초기 상태 (버튼을 눌러 비동기 로딩 테스트)' }
      ];
      loadingSelect.value = 'initial';
    }
  });

  return (
    <>
      <DocSection {...docs.basic}>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>Slot 방식 검색 셀렉트</h4>
            <div
              dangerouslySetInnerHTML={`
                <ag-select-search name="brand-search" width="250px">
                  <option value="kia">기아자동차</option>
                  <option value="hyundai" selected>현대자동차</option>
                  <option value="bmw">BMW</option>
                  <option value="benz">Mercedes-Benz</option>
                  <option value="audi">Audi</option>
                  <option value="volkswagen">Volkswagen</option>
                </ag-select-search>
              `}
            />
            <p class="demo-note">
              🔍 드롭다운을 열고 "현대", "ㅎㄷ", "bmw" 등으로 검색해보세요
            </p>
          </div>

          <div class="demo-item">
            <h4>배열 방식 검색 셀렉트</h4>
            <div
              dangerouslySetInnerHTML={`<ag-select-search id="dynamic-search" name="city-search" width="250px"></ag-select-search>`}
            />
            <p class="demo-note">
              🏙️ "서울", "ㅅㅇ", "광역", "ㄱㅇ" 등으로 지역을 검색해보세요
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection {...docs.search}>
        <div class="demo-item">
          <h4>초성 검색 기능 테스트</h4>
          <div
            dangerouslySetInnerHTML={`
              <ag-select-search name="search-demo" width="300px">
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
              </ag-select-search>
            `}
          />
          <div class="demo-note">
            <strong>검색 예시:</strong><br/>
            • <code>"서울"</code> → 서울특별시 매칭<br/>
            • <code>"ㅅㅇ"</code> → 서울특별시 매칭<br/>
            • <code>"광역"</code> → 모든 광역시 매칭<br/>
            • <code>"ㄱㅇ"</code> → 광주광역시, 경기도 매칭
          </div>
        </div>
      </DocSection>

      <DocSection {...docs.loading}>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>지속적 로딩 상태</h4>
            <div
              dangerouslySetInnerHTML={`<ag-select-search id="loading-search-demo" name="loading-search" width="300px"></ag-select-search>`}
            />
            <p class="demo-note">
              💫 옵션이 비어있어서 드롭다운을 열 때마다 로딩 상태가 표시됩니다
            </p>
          </div>

          <div class="demo-item">
            <h4>비동기 로딩 시뮬레이션</h4>
            <div
              dangerouslySetInnerHTML={`<ag-select-search id="async-loading-demo" name="async-search" width="350px"></ag-select-search>`}
            />
            <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem;">
              <button type="button" onClick$={triggerAsyncLoading} class="gradient-btn">
                데이터 로딩 시작
              </button>
              <button type="button" onClick$={resetAsyncDemo} class="gradient-btn clear">
                초기화
              </button>
            </div>
            <p class="demo-note">
              ⚡ 2초 후 기술 스택 데이터가 로딩되어 검색 가능해집니다
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection {...docs.virtual}>
        <div class="demo-item">
          <h4>10,000개 옵션 - 실시간 검색</h4>
          <div
            dangerouslySetInnerHTML={`<ag-select-search id="large-search" name="large-search-data" width="350px"></ag-select-search>`}
          />
          <div class="demo-note">
            <strong>검색 예시:</strong><br/>
            • <code>"프론트"</code> → 프론트엔드 관련 항목들<br/>
            • <code>"ㅍㄹㅌ"</code> → 프론트엔드 항목들 (초성 검색)<br/>
            • <code>"백엔드"</code> → 백엔드 관련 항목들<br/>
            • <code>"0001"</code> → 특정 번호의 항목들
          </div>
        </div>
      </DocSection>

      <DocSection {...docs.multiple}>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>다중 선택과 검색 조합</h4>
            <div
              dangerouslySetInnerHTML={`
                <ag-select-search id="multi-search-demo" multiple name="skills-search" width="400px">
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
                </ag-select-search>
              `}
            />
            <button type="button" onClick$={() => clearEventLog('multi-event-log')} class="gradient-btn clear">
              로그 지우기
            </button>
            <p class="demo-note">
              🏷️ "script", "ㅅㅋㄹㅍㅌ" 등으로 검색 후 선택해보세요. 모든 항목을 선택하면 "데이터 없음"이 표시됩니다.
            </p>
          </div>

          <div class="demo-item">
            <h4>다중 선택 이벤트 로그</h4>
            <div id="multi-event-log" class="event-log"></div>
            <p class="demo-note">
              📝 선택/해제/리셋 이벤트가 실시간으로 기록됩니다
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection {...docs.events}>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>검색 이벤트 테스트</h4>
            <div
              dangerouslySetInnerHTML={`
                <ag-select-search id="event-search-demo" name="event-search" width="250px">
                  <option value="option1">첫 번째 옵션</option>
                  <option value="option2">두 번째 옵션</option>
                  <option value="option3">세 번째 옵션</option>
                  <option value="option4">네 번째 옵션</option>
                  <option value="option5">다섯 번째 옵션</option>
                </ag-select-search>
              `}
            />
            <button type="button" onClick$={() => clearEventLog('search-event-log')} class="gradient-btn clear">
              로그 지우기
            </button>
            <p class="demo-note">
              🔍 "첫", "ㅊㅂ", "옵션" 등으로 검색 후 선택해보세요
            </p>
          </div>

          <div class="demo-item">
            <h4>검색 이벤트 로그</h4>
            <div id="search-event-log" class="event-log"></div>
            <p class="demo-note">
              ⏰ 타임스탬프와 함께 모든 이벤트가 기록됩니다
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection {...docs.form}>
        <form
          preventdefault:submit
          onSubmit$={handleFormSubmit}
          class="demo-form"
        >
          <div class="form-field">
            <label>
              거주 지역 (필수):
              <div
                dangerouslySetInnerHTML={`
                  <ag-select-search name="region" required width="200px">
                    <option value="">선택해주세요</option>
                    <option value="seoul">서울특별시</option>
                    <option value="busan">부산광역시</option>
                    <option value="daegu">대구광역시</option>
                    <option value="incheon">인천광역시</option>
                    <option value="gwangju">광주광역시</option>
                    <option value="daejeon">대전광역시</option>
                    <option value="ulsan">울산광역시</option>
                  </ag-select-search>
                `}
              />
            </label>
          </div>

          <div class="form-field">
            <label>
              관심 분야 (다중 선택):
              <div
                dangerouslySetInnerHTML={`
                  <ag-select-search name="interests" multiple width="300px">
                    <option value="frontend">프론트엔드 개발</option>
                    <option value="backend">백엔드 개발</option>
                    <option value="mobile">모바일 앱 개발</option>
                    <option value="ai">인공지능/머신러닝</option>
                    <option value="blockchain">블록체인</option>
                    <option value="devops">데브옵스/인프라</option>
                    <option value="design">UI/UX 디자인</option>
                    <option value="data">데이터 분석</option>
                  </ag-select-search>
                `}
              />
            </label>
          </div>

          <button type="submit" class="gradient-btn submit">제출</button>

          <div class="form-output-container">
            <h4>폼 데이터 출력:</h4>
            <pre class="form-output"></pre>
          </div>
        </form>
      </DocSection>

      <DocSection {...docs.performance}>
        <div class="demo-item">
          <h4>성능 최적화 데모</h4>
          <div
            dangerouslySetInnerHTML={`<ag-select-search id="performance-demo" name="products" width="350px"></ag-select-search>`}
          />
          <p class="demo-note">
            🚀 실제 프로젝트에서는 이와 같이 API 데이터를 비동기로 로딩하여 사용하세요
          </p>
        </div>
      </DocSection>
    </>
  );
});