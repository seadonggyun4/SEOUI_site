import { component$, $, useVisibleTask$ } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { docs } from './docs';

interface CustomSelectSearchElement extends HTMLElement {
  optionItems?: { value: string; label: string }[];
  value?: string;
  selectedValues?: string[];
  multiple?: boolean;
  showReset?: boolean;
  dark?: boolean;
  resetToDefaultValue?: () => void;
  _searchText?: string;
}

export default component$(() => {
  useVisibleTask$(() => {
    import('@/components/seo-select-search').then((mod) => {
      if (!customElements.get('seo-select-search')) {
        customElements.define('seo-select-search', mod.AgSelectSearch);
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

      // 다중 선택 검색 데모 설정
      const multiSearchSelect = document.getElementById('multi-search-demo') as CustomSelectSearchElement;
      if (multiSearchSelect) {
        // 이벤트 리스너 등록
        multiSearchSelect.addEventListener('onSelect', (event: Event) => {
          const { value, label } = (event as CustomEvent).detail;
          const log = document.getElementById('multi-event-log');
          if (log) {
            log.innerHTML += `<div>선택됨: ${value} (${label})</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });

        multiSearchSelect.addEventListener('onDeselect', (event: Event) => {
          const { value, label } = (event as CustomEvent).detail;
          const log = document.getElementById('multi-event-log');
          if (log) {
            log.innerHTML += `<div class="deselect">해제됨: ${value} (${label})</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });

        multiSearchSelect.addEventListener('onReset', () => {
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
        eventSearchSelect.addEventListener('onSelect', (event: Event) => {
          const { value, label } = (event as CustomEvent).detail;
          const log = document.getElementById('search-event-log');
          if (log) {
            const time = new Date().toLocaleTimeString();
            log.innerHTML += `<div>[${time}] 선택: ${label} (값: ${value})</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });

        eventSearchSelect.addEventListener('onReset', () => {
          const log = document.getElementById('search-event-log');
          if (log) {
            const time = new Date().toLocaleTimeString();
            log.innerHTML += `<div class="reset">[${time}] 리셋됨 - 검색어도 초기화</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });

        eventSearchSelect.addEventListener('change', (event: Event) => {
          const log = document.getElementById('search-event-log');
          if (log) {
            const time = new Date().toLocaleTimeString();
            log.innerHTML += `<div>[${time}] 폼 값 변경: ${(event.target as HTMLElement).getAttribute('value')}</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });
      }

      // 다크 모드 다중 선택 검색 데모 설정
      const darkMultiSearchSelect = document.getElementById('dark-multi-search-demo') as CustomSelectSearchElement;
      if (darkMultiSearchSelect) {
        darkMultiSearchSelect.selectedValues = ['seoul', 'busan'];
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

  const clearEventLog = $((logId: string) => {
    const log = document.getElementById(logId);
    if (log) log.innerHTML = '';
  });

  return (
    <>
      <DocSection {...docs.basic}>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>Slot 방식 검색 셀렉트</h4>
            <div
              dangerouslySetInnerHTML={`
                <seo-select-search name="brand-search" width="250px">
                  <option value="kia">기아자동차</option>
                  <option value="hyundai" selected>현대자동차</option>
                  <option value="bmw">BMW</option>
                  <option value="benz">Mercedes-Benz</option>
                  <option value="audi">Audi</option>
                  <option value="volkswagen">Volkswagen</option>
                </seo-select-search>
              `}
            />
            <p class="demo-note">
              🔍 드롭다운을 열고 "현대", "ㅎㄷ", "bmw" 등으로 검색해보세요
            </p>
          </div>

          <div class="demo-item">
            <h4>배열 방식 검색 셀렉트</h4>
            <div
              dangerouslySetInnerHTML={`<seo-select-search id="dynamic-search" name="city-search" width="250px"></seo-select-search>`}
            />
            <p class="demo-note">
              🏙️ "서울", "ㅅㅇ", "광역", "ㄱㅇ" 등으로 지역을 검색해보세요
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection {...docs.theme}>
        <div class="demo-item">
          <h4>Float 테마 (기본값) - 검색 기능</h4>
          <div
            dangerouslySetInnerHTML={`
              <seo-select-search name="search-float" theme="float" width="250px">
                <option value="js">JavaScript</option>
                <option value="ts">TypeScript</option>
                <option value="react">React</option>
                <option value="vue">Vue.js</option>
                <option value="angular">Angular</option>
                <option value="svelte">Svelte</option>
              </seo-select-search>
            `}
          />
          <p class="demo-note">
            🎨 둥근 모서리, 그라데이션 글로우, 슬라이드 애니메이션이 적용됩니다. "script", "ㅅㅋㄹㅍㅌ" 등으로 검색해보세요.
          </p>
        </div>

        <div class="demo-item">
          <h4>Basic 테마 - 검색 기능</h4>
          <div
            dangerouslySetInnerHTML={`
              <seo-select-search name="search-basic" theme="basic" width="250px">
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
              </seo-select-search>
            `}
          />
          <p class="demo-note">
            📐 직각 모서리와 즉시 표시되는 전통적인 스타일입니다. "java", "ㅈㅂ" 등으로 검색해보세요.
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.search}>
        <div class="demo-item">
          <h4>초성 검색 기능 테스트</h4>
          <div
            dangerouslySetInnerHTML={`
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
        <div class="demo-item">
          <h4>지속적 로딩 상태</h4>
          <div
            dangerouslySetInnerHTML={`<seo-select-search id="loading-search-demo" name="loading-search" width="300px"></seo-select-search>`}
          />
          <p class="demo-note">
            💫 옵션이 비어있어서 드롭다운을 열 때마다 로딩 상태가 표시됩니다
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.virtual}>
        <div class="demo-item">
          <h4>10,000개 옵션 - 실시간 검색</h4>
          <div
            dangerouslySetInnerHTML={`<seo-select-search id="large-search" name="large-search-data" width="350px"></seo-select-search>`}
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
                <seo-select-search id="multi-search-demo" multiple name="skills-search" width="400px">
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

      <DocSection {...docs.darkmode}>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>라이트 모드 vs 다크 모드 검색 비교</h4>
            <div class="button-group">
              <div class="comparison-item">
                <h5>라이트 모드 검색</h5>
                <div
                  dangerouslySetInnerHTML={`
                    <seo-select-search name="light-search-demo" theme="float" width="250px">
                      <option value="apple">사과 (Apple)</option>
                      <option value="banana">바나나 (Banana)</option>
                      <option value="cherry">체리 (Cherry)</option>
                      <option value="date">대추 (Date)</option>
                      <option value="elderberry">엘더베리 (Elderberry)</option>
                    </seo-select-search>
                  `}
                />
              </div>

              <div class="comparison-item">
                <h5>다크 모드 검색</h5>
                <div
                  dangerouslySetInnerHTML={`
                    <seo-select-search name="dark-search-demo" theme="float" dark width="250px">
                      <option value="apple">사과 (Apple)</option>
                      <option value="banana">바나나 (Banana)</option>
                      <option value="cherry">체리 (Cherry)</option>
                      <option value="date">대추 (Date)</option>
                      <option value="elderberry">엘더베리 (Elderberry)</option>
                    </seo-select-search>
                  `}
                />
              </div>
            </div>
            <p class="demo-note">
              🌓 검색창의 색상, 포커스 효과, 아이콘까지 모든 요소가 다크 테마로 변환됩니다. "사과", "ㅅㄱ" 등으로 검색해보세요.
            </p>
          </div>

          <div class="demo-item">
            <h4>테마별 다크 모드 검색 비교</h4>
            <div class="button-group">
              <div class="theme-item">
                <h5>Basic 테마 + 다크 모드</h5>
                <div
                  dangerouslySetInnerHTML={`
                    <seo-select-search name="basic-dark-search" theme="basic" dark width="200px">
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="go">Go</option>
                      <option value="rust">Rust</option>
                    </seo-select-search>
                  `}
                />
              </div>

              <div class="theme-item">
                <h5>Float 테마 + 다크 모드</h5>
                <div
                  dangerouslySetInnerHTML={`
                    <seo-select-search name="float-dark-search" theme="float" dark width="200px">
                      <option value="react">React</option>
                      <option value="vue">Vue.js</option>
                      <option value="angular">Angular</option>
                      <option value="svelte">Svelte</option>
                    </seo-select-search>
                  `}
                />
              </div>
            </div>
            <p class="demo-note">
              🎭 모든 테마에서 검색 기능과 다크 모드가 완벽하게 지원됩니다. "java", "ㅈㅂ", "react", "ㄹㅇ" 등으로 검색해보세요.
            </p>
          </div>

          <div class="demo-item">
            <h4>다중 선택 + 다크 모드 + 검색</h4>
            <div
              dangerouslySetInnerHTML={`
                <seo-select-search id="dark-multi-search-demo" multiple name="dark-region-search" theme="float" dark width="350px">
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
              `}
            />
            <p class="demo-note">
              🏷️ 다크 모드에서 태그, 검색창, 드롭다운이 모두 완벽하게 동작합니다. "광역", "ㄱㅇ" 등으로 검색해보세요.
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
                <seo-select-search id="event-search-demo" name="event-search" width="250px">
                  <option value="option1">첫 번째 옵션</option>
                  <option value="option2">두 번째 옵션</option>
                  <option value="option3">세 번째 옵션</option>
                  <option value="option4">네 번째 옵션</option>
                  <option value="option5">다섯 번째 옵션</option>
                </seo-select-search>
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
                `}
              />
            </label>
          </div>

          <div class="form-field">
            <label>
              관심 분야 (다중 선택):
              <div
                dangerouslySetInnerHTML={`
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
    </>
  );
});