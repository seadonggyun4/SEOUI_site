import { component$, $, useVisibleTask$, useStore } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslateDocs, createTranslations, type DocItem } from '@/utils/translate';
import { docs } from './docs';
import { translations } from './translations';

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

export interface DocsStructure {
  __lang?: string;
  basic: DocItem;
  theme: DocItem;
  search: DocItem;
  loading: DocItem;
  virtual: DocItem;
  multiple: DocItem;
  events: DocItem;
  form: DocItem;
  darkmode: DocItem;
}

export default component$(() => {
  const { selectedLanguage } = useLanguage();
  const translatedDocs = useTranslateDocs(docs, selectedLanguage);

  // 컴포넌트 초기화 상태 관리 (한 번만 실행)
  const componentState = useStore({
    initialized: false
  });

  // 다국어 번역 데이터 생성
  const t = createTranslations(
    translations,
    {
      // 섹션 제목들
      slotMethodSearch: 'slot.method.search',
      arrayMethodSearch: 'array.method.search',
      floatThemeSearch: 'float.theme.search',
      basicThemeSearch: 'basic.theme.search',
      chosungSearchTest: 'chosung.search.test',
      continuousLoadingState: 'continuous.loading.state',
      largeDatasetSearch: 'large.dataset.search',
      multipleSelectionSearch: 'multiple.selection.search',
      searchEventTest: 'search.event.test',
      lightVsDarkSearch: 'light.vs.dark.search',
      themeDarkComparison: 'theme.dark.comparison',
      multiDarkSearch: 'multi.dark.search',

      // 데모 설명 노트들
      demoNoteSlotSearch: 'demo.note.slot.search',
      demoNoteArraySearch: 'demo.note.array.search',
      demoNoteFloatSearch: 'demo.note.float.search',
      demoNoteBasicSearch: 'demo.note.basic.search',
      demoNoteChosungTest: 'demo.note.chosung.test',
      demoNoteContinuousLoading: 'demo.note.continuous.loading',
      demoNoteLargeSearch: 'demo.note.large.search',
      demoNoteMultiSearch: 'demo.note.multi.search',
      demoNoteSearchEvent: 'demo.note.search.event',
      demoNoteColorTheme: 'demo.note.color.theme',
      demoNoteThemeComparison: 'demo.note.theme.comparison',
      demoNoteMultiDark: 'demo.note.multi.dark',

      // 버튼 텍스트들
      clearLog: 'clear.log',
      submit: 'submit',
      startLoading: 'start.loading',

      // 폼 라벨들
      regionRequired: 'region.required',
      pleaseSelect: 'please.select',
      interestsMultiple: 'interests.multiple',
      formDataOutput: 'form.data.output',

      // 이벤트 로그 텍스트들
      eventLogPlaceholder: 'event.log.placeholder',
      multiEventLog: 'multi.event.log',
      searchEventLog: 'search.event.log',
      selected: 'selected',
      deselected: 'deselected',
      resetCompleted: 'reset.completed',
      searchReset: 'search.reset',
      formValueChanged: 'form.value.changed',

      // 지역 이름들
      seoul: 'seoul',
      busan: 'busan',
      daegu: 'daegu',
      incheon: 'incheon',
      gwangju: 'gwangju',
      daejeon: 'daejeon',
      ulsan: 'ulsan',
      sejong: 'sejong',
      gyeonggi: 'gyeonggi',
      gangwon: 'gangwon',
      chungbuk: 'chungbuk',
      chungnam: 'chungnam',
      jeonbuk: 'jeonbuk',
      jeonnam: 'jeonnam',
      gyeongbuk: 'gyeongbuk',
      gyeongnam: 'gyeongnam',
      jeju: 'jeju',

      // 기술 스택들
      javascript: 'javascript',
      typescript: 'typescript',
      react: 'react',
      vue: 'vue',
      angular: 'angular',
      svelte: 'svelte',
      nodejs: 'nodejs',
      python: 'python',
      java: 'java',
      csharp: 'csharp',
      php: 'php',
      ruby: 'ruby',
      go: 'go',
      rust: 'rust',
      kotlin: 'kotlin',
      swift: 'swift',

      // 자동차 브랜드들
      kiaMotors: 'kia.motors',
      hyundaiMotor: 'hyundai.motor',

      // 관심 분야들
      frontendDev: 'frontend.dev',
      backendDev: 'backend.dev',
      mobileDev: 'mobile.dev',
      aiMl: 'ai.ml',
      blockchain: 'blockchain',
      devops: 'devops',
      uiuxDesign: 'uiux.design',
      dataAnalysis: 'data.analysis',

      // 과일들
      apple: 'apple',
      banana: 'banana',
      cherry: 'cherry',
      date: 'date',
      elderberry: 'elderberry',

      // 옵션 텍스트들
      option: 'option',
      firstOption: 'first.option',
      secondOption: 'second.option',
      thirdOption: 'third.option',
      fourthOption: 'fourth.option',
      fifthOption: 'fifth.option',

      // 기타 텍스트들
      item: 'item',
      techStack: 'tech.stack',
      detailDescription: 'detail.description',
      dynamicLoadedItem: 'dynamic.loaded.item',
      dataLoadingComplete: 'data.loading.complete',
      searchActivated: 'search.activated',
      lightModeSearch: 'light.mode.search',
      darkModeSearch: 'dark.mode.search',
      basicThemeDark: 'basic.theme.dark',
      floatThemeDark: 'float.theme.dark',

      // 검색 예시 텍스트들
      searchExample: 'search.example',
      searchExampleSeoul: 'search.example.seoul',
      searchExampleChosung: 'search.example.chosung',
      searchExampleMetro: 'search.example.metro',
      searchExampleChosungMulti: 'search.example.chosung.multi',
      searchExampleFrontend: 'search.example.frontend',
      searchExampleJava: 'search.example.java',
      searchExampleNumber: 'search.example.number'
    },
    selectedLanguage.value
  );

  // Lit 컴포넌트 초기화 및 DOM 조작 (언어 변경과 무관)
  useVisibleTask$(() => {
    import('@/components/seo-select-search').then((mod) => {
      if (!customElements.get('seo-select-search')) {
        customElements.define('seo-select-search', mod.AgSelectSearch);
      }

      if (!componentState.initialized) {
        // 대용량 검색 데모 설정
        const largeSearchSelect = document.getElementById('large-search') as CustomSelectSearchElement;
        if (largeSearchSelect) {
          const categories = [t.frontendDev, t.backendDev, '데이터베이스', '인프라', '보안', '모바일', 'AI/ML', '디자인'];
          largeSearchSelect.optionItems = Array.from({ length: 10000 }, (_, i) => {
            const category = categories[i % categories.length];
            return {
              value: `item-${i.toString().padStart(4, '0')}`,
              label: `[${category}] ${t.techStack} ${i.toString().padStart(4, '0')} - ${t.detailDescription}`
            };
          });
        }

        // 동적 검색 데모 설정
        const dynamicSearchSelect = document.getElementById('dynamic-search') as CustomSelectSearchElement;
        if (dynamicSearchSelect) {
          dynamicSearchSelect.optionItems = [
            { value: 'seoul', label: t.seoul },
            { value: 'busan', label: t.busan },
            { value: 'daegu', label: t.daegu },
            { value: 'incheon', label: t.incheon },
            { value: 'gwangju', label: t.gwangju },
            { value: 'daejeon', label: t.daejeon },
            { value: 'ulsan', label: t.ulsan },
            { value: 'sejong', label: t.sejong },
            { value: 'gyeonggi', label: t.gyeonggi },
            { value: 'gangwon', label: t.gangwon },
            { value: 'chungbuk', label: t.chungbuk },
            { value: 'chungnam', label: t.chungnam },
            { value: 'jeonbuk', label: t.jeonbuk },
            { value: 'jeonnam', label: t.jeonnam },
            { value: 'gyeongbuk', label: t.gyeongbuk },
            { value: 'gyeongnam', label: t.gyeongnam },
            { value: 'jeju', label: t.jeju }
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
              log.innerHTML += `<div>${t.selected}: ${value} (${label})</div>`;
              log.scrollTop = log.scrollHeight;
            }
          });

          multiSearchSelect.addEventListener('onDeselect', (event: Event) => {
            const { value, label } = (event as CustomEvent).detail;
            const log = document.getElementById('multi-event-log');
            if (log) {
              log.innerHTML += `<div class="deselect">${t.deselected}: ${value} (${label})</div>`;
              log.scrollTop = log.scrollHeight;
            }
          });

          multiSearchSelect.addEventListener('onReset', () => {
            const log = document.getElementById('multi-event-log');
            if (log) {
              log.innerHTML += `<div class="reset">${t.searchReset}</div>`;
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
              log.innerHTML += `<div>[${time}] ${t.selected}: ${label} (${value})</div>`;
              log.scrollTop = log.scrollHeight;
            }
          });

          eventSearchSelect.addEventListener('onReset', () => {
            const log = document.getElementById('search-event-log');
            if (log) {
              const time = new Date().toLocaleTimeString();
              log.innerHTML += `<div class="reset">[${time}] ${t.searchReset}</div>`;
              log.scrollTop = log.scrollHeight;
            }
          });

          eventSearchSelect.addEventListener('change', (event: Event) => {
            const log = document.getElementById('search-event-log');
            if (log) {
              const time = new Date().toLocaleTimeString();
              log.innerHTML += `<div>[${time}] ${t.formValueChanged}: ${(event.target as HTMLElement).getAttribute('value')}</div>`;
              log.scrollTop = log.scrollHeight;
            }
          });
        }

        // 다크 모드 다중 선택 검색 데모 설정
        const darkMultiSearchSelect = document.getElementById('dark-multi-search-demo') as CustomSelectSearchElement;
        if (darkMultiSearchSelect) {
          darkMultiSearchSelect.selectedValues = ['seoul', 'busan'];
        }

        // 로딩 데모 함수 등록
        (window as any).loadSearchData = () => {
          const loadingSelect = document.getElementById('loading-search-demo') as CustomSelectSearchElement;
          if (loadingSelect) {
            setTimeout(() => {
              loadingSelect.optionItems = Array.from({ length: 50 }, (_, i) => ({
                value: `item-${i}`,
                label: `${t.dynamicLoadedItem} ${i + 1}`
              }));
              console.log(`${t.dataLoadingComplete} - ${t.searchActivated}`);
            }, 2000);
          }
        };

        componentState.initialized = true;
      }
    });
  });

  // 폼 제출 핸들러
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
      if (result.length > 25) {
        output.textContent = result;
        output.style.color = '#f9fafb';
        output.style.fontStyle = 'normal';
      } else {
        output.textContent = '(폼 데이터 없음)';
        output.style.color = '#6b7280';
        output.style.fontStyle = 'italic';
      }
    }
  });

  // 이벤트 로그 클리어 핸들러
  const clearEventLog = $((logId: string) => {
    const log = document.getElementById(logId);
    if (log) {
      log.innerHTML = '';
      // 로그가 비어있을 때 placeholder 텍스트 표시
      setTimeout(() => {
        if (log.innerHTML === '') {
          log.innerHTML = `<div style="color: #6b7280; font-style: italic;">${t.eventLogPlaceholder}</div>`;
        }
      }, 100);
    }
  });

  // lookupMap 방식으로 구조화된 렌더링
  return (
    <>
      {(() => {
        const currentDocs = translatedDocs.value as DocsStructure;
        
        // 문서 섹션들을 lookupMap으로 구조화
        const docSections = {
          basic: {
            doc: currentDocs.basic,
            content: (
              <div class="demo-grid">
                <div class="demo-item">
                  <h4>{t.slotMethodSearch}</h4>
                  <div
                    dangerouslySetInnerHTML={`
                      <seo-select-search name="brand-search" width="250px">
                        <option value="kia">${t.kiaMotors}</option>
                        <option value="hyundai" selected>${t.hyundaiMotor}</option>
                        <option value="bmw">BMW</option>
                        <option value="benz">Mercedes-Benz</option>
                        <option value="audi">Audi</option>
                        <option value="volkswagen">Volkswagen</option>
                      </seo-select-search>
                    `}
                  />
                  <p class="demo-note">
                    {t.demoNoteSlotSearch}
                  </p>
                </div>

                <div class="demo-item">
                  <h4>{t.arrayMethodSearch}</h4>
                  <div
                    dangerouslySetInnerHTML={`<seo-select-search id="dynamic-search" name="city-search" width="250px"></seo-select-search>`}
                  />
                  <p class="demo-note">
                    {t.demoNoteArraySearch}
                  </p>
                </div>
              </div>
            )
          },

          theme: {
            doc: currentDocs.theme,
            content: (
              <>
                <div class="demo-item">
                  <h4>{t.floatThemeSearch}</h4>
                  <div
                    dangerouslySetInnerHTML={`
                      <seo-select-search name="search-float" theme="float" width="250px">
                        <option value="js">${t.javascript}</option>
                        <option value="ts">${t.typescript}</option>
                        <option value="react">${t.react}</option>
                        <option value="vue">${t.vue}</option>
                        <option value="angular">${t.angular}</option>
                        <option value="svelte">${t.svelte}</option>
                      </seo-select-search>
                    `}
                  />
                  <p class="demo-note">
                    {t.demoNoteFloatSearch}
                  </p>
                </div>

                <div class="demo-item">
                  <h4>{t.basicThemeSearch}</h4>
                  <div
                    dangerouslySetInnerHTML={`
                      <seo-select-search name="search-basic" theme="basic" width="250px">
                        <option value="python">${t.python}</option>
                        <option value="java">${t.java}</option>
                        <option value="go">${t.go}</option>
                        <option value="rust">${t.rust}</option>
                        <option value="php">${t.php}</option>
                        <option value="ruby">${t.ruby}</option>
                      </seo-select-search>
                    `}
                  />
                  <p class="demo-note">
                    {t.demoNoteBasicSearch}
                  </p>
                </div>
              </>
            )
          },

          search: {
            doc: currentDocs.search,
            content: (
              <div class="demo-item">
                <h4>{t.chosungSearchTest}</h4>
                <div
                  dangerouslySetInnerHTML={`
                    <seo-select-search name="search-demo" width="300px">
                      <option value="seoul">${t.seoul}</option>
                      <option value="busan">${t.busan}</option>
                      <option value="daegu">${t.daegu}</option>
                      <option value="incheon">${t.incheon}</option>
                      <option value="gwangju">${t.gwangju}</option>
                      <option value="daejeon">${t.daejeon}</option>
                      <option value="ulsan">${t.ulsan}</option>
                      <option value="sejong">${t.sejong}</option>
                      <option value="gyeonggi">${t.gyeonggi}</option>
                      <option value="gangwon">${t.gangwon}</option>
                    </seo-select-search>
                  `}
                />
                <div class="demo-note">
                  {t.demoNoteChosungTest}
                </div>
              </div>
            )
          },

          loading: {
            doc: currentDocs.loading,
            content: (
              <div class="demo-item">
                <h4>{t.continuousLoadingState}</h4>
                <div
                  dangerouslySetInnerHTML={`<seo-select-search id="loading-search-demo" name="loading-search" width="300px"></seo-select-search>`}
                />
                <button type="button" onClick$={() => (window as any).loadSearchData?.()} class="gradient-btn">
                  {t.startLoading}
                </button>
                <p class="demo-note">
                  {t.demoNoteContinuousLoading}
                </p>
              </div>
            )
          },

          virtual: {
            doc: currentDocs.virtual,
            content: (
              <div class="demo-item">
                <h4>{t.largeDatasetSearch}</h4>
                <div
                  dangerouslySetInnerHTML={`<seo-select-search id="large-search" name="large-search-data" width="350px"></seo-select-search>`}
                />
                <div class="demo-note">
                  {t.demoNoteLargeSearch}
                </div>
              </div>
            )
          },

          multiple: {
            doc: currentDocs.multiple,
            content: (
              <div class="demo-grid">
                <div class="demo-item">
                  <h4>{t.multipleSelectionSearch}</h4>
                  <div
                    dangerouslySetInnerHTML={`
                      <seo-select-search id="multi-search-demo" multiple name="skills-search" width="400px">
                        <option value="javascript">${t.javascript}</option>
                        <option value="typescript">${t.typescript}</option>
                        <option value="react">${t.react}</option>
                        <option value="vue">${t.vue}</option>
                        <option value="angular">${t.angular}</option>
                        <option value="svelte">${t.svelte}</option>
                        <option value="nodejs">${t.nodejs}</option>
                        <option value="python">${t.python}</option>
                        <option value="java">${t.java}</option>
                        <option value="csharp">${t.csharp}</option>
                        <option value="php">${t.php}</option>
                        <option value="ruby">${t.ruby}</option>
                        <option value="go">${t.go}</option>
                        <option value="rust">${t.rust}</option>
                        <option value="kotlin">${t.kotlin}</option>
                        <option value="swift">${t.swift}</option>
                      </seo-select-search>
                    `}
                  />
                  <button type="button" onClick$={() => clearEventLog('multi-event-log')} class="gradient-btn clear">
                    {t.clearLog}
                  </button>
                  <p class="demo-note">
                    {t.demoNoteMultiSearch}
                  </p>
                </div>

                <div class="demo-item">
                  <h4>{t.multiEventLog}</h4>
                  <div id="multi-event-log" class="event-log"></div>
                  <p class="demo-note">
                    📝 선택/해제/리셋 이벤트가 실시간으로 기록됩니다
                  </p>
                </div>
              </div>
            )
          },

          events: {
            doc: currentDocs.events,
            content: (
              <div class="demo-grid">
                <div class="demo-item">
                  <h4>{t.searchEventTest}</h4>
                  <div
                    dangerouslySetInnerHTML={`
                      <seo-select-search id="event-search-demo" name="event-search" width="250px">
                        <option value="option1">${t.firstOption}</option>
                        <option value="option2">${t.secondOption}</option>
                        <option value="option3">${t.thirdOption}</option>
                        <option value="option4">${t.fourthOption}</option>
                        <option value="option5">${t.fifthOption}</option>
                      </seo-select-search>
                    `}
                  />
                  <button type="button" onClick$={() => clearEventLog('search-event-log')} class="gradient-btn clear">
                    {t.clearLog}
                  </button>
                  <p class="demo-note">
                    {t.demoNoteSearchEvent}
                  </p>
                </div>

                <div class="demo-item">
                  <h4>{t.searchEventLog}</h4>
                  <div id="search-event-log" class="event-log"></div>
                  <p class="demo-note">
                    ⏰ 타임스탬프와 함께 모든 이벤트가 기록됩니다
                  </p>
                </div>
              </div>
            )
          },

          darkmode: {
            doc: currentDocs.darkmode,
            content: (
              <div class="demo-grid">
                <div class="demo-item">
                  <h4>{t.lightVsDarkSearch}</h4>
                  <div class="flex-group">
                    <div class="comparison-item">
                      <h5>{t.lightModeSearch}</h5>
                      <div
                        dangerouslySetInnerHTML={`
                          <seo-select-search name="light-search-demo" theme="float" width="250px">
                            <option value="apple">${t.apple}</option>
                            <option value="banana">${t.banana}</option>
                            <option value="cherry">${t.cherry}</option>
                            <option value="date">${t.date}</option>
                            <option value="elderberry">${t.elderberry}</option>
                          </seo-select-search>
                        `}
                      />
                    </div>

                    <div class="comparison-item">
                      <h5>{t.darkModeSearch}</h5>
                      <div
                        dangerouslySetInnerHTML={`
                          <seo-select-search name="dark-search-demo" theme="float" dark width="250px">
                            <option value="apple">${t.apple}</option>
                            <option value="banana">${t.banana}</option>
                            <option value="cherry">${t.cherry}</option>
                            <option value="date">${t.date}</option>
                            <option value="elderberry">${t.elderberry}</option>
                          </seo-select-search>
                        `}
                      />
                    </div>
                  </div>
                  <p class="demo-note">
                    {t.demoNoteColorTheme}
                  </p>
                </div>

                <div class="demo-item">
                  <h4>{t.themeDarkComparison}</h4>
                  <div class="flex-group">
                    <div class="theme-item">
                      <h5>{t.basicThemeDark}</h5>
                      <div
                        dangerouslySetInnerHTML={`
                          <seo-select-search name="basic-dark-search" theme="basic" dark width="200px">
                            <option value="python">${t.python}</option>
                            <option value="java">${t.java}</option>
                            <option value="go">${t.go}</option>
                            <option value="rust">${t.rust}</option>
                          </seo-select-search>
                        `}
                      />
                    </div>

                    <div class="theme-item">
                      <h5>{t.floatThemeDark}</h5>
                      <div
                        dangerouslySetInnerHTML={`
                          <seo-select-search name="float-dark-search" theme="float" dark width="200px">
                            <option value="react">${t.react}</option>
                            <option value="vue">${t.vue}</option>
                            <option value="angular">${t.angular}</option>
                            <option value="svelte">${t.svelte}</option>
                          </seo-select-search>
                        `}
                      />
                    </div>
                  </div>
                  <p class="demo-note">
                    {t.demoNoteThemeComparison}
                  </p>
                </div>

                <div class="demo-item">
                  <h4>{t.multiDarkSearch}</h4>
                  <div
                    dangerouslySetInnerHTML={`
                      <seo-select-search id="dark-multi-search-demo" multiple name="dark-region-search" theme="float" dark width="350px">
                        <option value="seoul">${t.seoul}</option>
                        <option value="busan">${t.busan}</option>
                        <option value="daegu">${t.daegu}</option>
                        <option value="incheon">${t.incheon}</option>
                        <option value="gwangju">${t.gwangju}</option>
                        <option value="daejeon">${t.daejeon}</option>
                        <option value="ulsan">${t.ulsan}</option>
                        <option value="sejong">${t.sejong}</option>
                        <option value="gyeonggi">${t.gyeonggi}</option>
                        <option value="gangwon">${t.gangwon}</option>
                      </seo-select-search>
                    `}
                  />
                  <p class="demo-note">
                    {t.demoNoteMultiDark}
                  </p>
                </div>
              </div>
            )
          },

          form: {
            doc: currentDocs.form,
            content: (
              <form
                preventdefault:submit
                onSubmit$={handleFormSubmit}
                class="demo-form"
              >
                <div class="form-field">
                  <label>
                    {t.regionRequired}
                    <div
                      dangerouslySetInnerHTML={`
                        <seo-select-search name="region" required width="200px">
                          <option value="">${t.pleaseSelect}</option>
                          <option value="seoul">${t.seoul}</option>
                          <option value="busan">${t.busan}</option>
                          <option value="daegu">${t.daegu}</option>
                          <option value="incheon">${t.incheon}</option>
                          <option value="gwangju">${t.gwangju}</option>
                          <option value="daejeon">${t.daejeon}</option>
                          <option value="ulsan">${t.ulsan}</option>
                        </seo-select-search>
                      `}
                    />
                  </label>
                </div>

                <div class="form-field">
                  <label>
                    {t.interestsMultiple}
                    <div
                      dangerouslySetInnerHTML={`
                        <seo-select-search name="interests" multiple width="300px">
                          <option value="frontend">${t.frontendDev}</option>
                          <option value="backend">${t.backendDev}</option>
                          <option value="mobile">${t.mobileDev}</option>
                          <option value="ai">${t.aiMl}</option>
                          <option value="blockchain">${t.blockchain}</option>
                          <option value="devops">${t.devops}</option>
                          <option value="design">${t.uiuxDesign}</option>
                          <option value="data">${t.dataAnalysis}</option>
                        </seo-select-search>
                      `}
                    />
                  </label>
                </div>

                <button type="submit" class="gradient-btn submit">{t.submit}</button>

                <div class="form-output-container">
                  <h4>{t.formDataOutput}</h4>
                  <pre class="form-output"></pre>
                </div>
              </form>
            )
          }
        };

        // lookupMap을 사용한 구조화된 렌더링
        return Object.entries(docSections).map(([sectionKey, { doc, content }]) => (
          <DocSection
            key={`${sectionKey}-${currentDocs.__lang}`} // 언어 변경 시 강제 리렌더링
            title={doc.title}
            description={doc.description}
            code={doc.code}
            lang={doc.lang}
            waitForComponents={['seo-select-search']}
          >
            {content}
          </DocSection>
        ));
      })()}
    </>
  );
});