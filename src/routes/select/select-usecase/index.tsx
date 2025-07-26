import { component$, $, useVisibleTask$, useStore } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslateDocs, createTranslations, type DocItem } from '@/utils/translate';
import { docs } from './docs';
import { translations } from './translations';

interface CustomSelectElement extends HTMLElement {
  optionItems?: { value: string; label: string }[];
  value?: string;
  selectedValues?: string[];
  multiple?: boolean;
  showReset?: boolean;
  dark?: boolean;
  resetToDefaultValue?: () => void;
}

export interface DocsStructure {
  __lang?: string;
  basic: DocItem;
  theme: DocItem;
  darkmode: DocItem;
  loading: DocItem;
  virtual: DocItem;
  keyboard: DocItem;
  events: DocItem;
  multiple: DocItem;
  reset: DocItem;
  form: DocItem;
  styling: DocItem;
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
      slotMethodRecommended: 'slot.method.recommended',
      arrayMethodFallback: 'array.method.fallback',
      floatThemeDefault: 'float.theme.default',
      basicTheme: 'basic.theme',
      continuousLoadingState: 'continuous.loading.state',
      largeDatasetVirtualScroll: 'large.dataset.virtual.scroll',
      keyboardNavigationTest: 'keyboard.navigation.test',
      eventGenerationTest: 'event.generation.test',
      eventLog: 'event.log',
      multipleSelectionMode: 'multiple.selection.mode',
      lightVsDarkMode: 'light.vs.dark.mode',
      lightModeDefault: 'light.mode.default',
      darkMode: 'dark.mode',
      multipleSelectionDarkMode: 'multiple.selection.dark.mode',
      resetButtonEnabled: 'reset.button.enabled',
      resetButtonDisabled: 'reset.button.disabled',
      autoWidthAdjustment: 'auto.width.adjustment',
      fixedWidth: 'fixed.width',

      // 데모 설명 노트들
      demoNoteRoundedCorners: 'demo.note.rounded.corners',
      demoNoteTraditionalStyle: 'demo.note.traditional.style',
      demoNoteContinuousLoading: 'demo.note.continuous.loading',
      demoNoteLargeDataset: 'demo.note.large.dataset',
      demoNoteKeyboardNavigation: 'demo.note.keyboard.navigation',
      demoNoteRealtimeEvents: 'demo.note.realtime.events',
      demoNoteTagDisplay: 'demo.note.tag.display',
      demoNoteSameComponent: 'demo.note.same.component',
      demoNoteDarkModeInteraction: 'demo.note.dark.mode.interaction',
      demoNoteResetCondition: 'demo.note.reset.condition',
      demoNoteResetDisabled: 'demo.note.reset.disabled',
      demoNoteAutoWidth: 'demo.note.auto.width',
      demoNoteFixedWidth: 'demo.note.fixed.width',

      // 버튼 텍스트들
      clearLog: 'clear.log',
      submit: 'submit',

      // 폼 라벨들
      preferredLanguageRequired: 'preferred.language.required',
      pleaseSelect: 'please.select',
      korean: 'korean',
      english: 'english',
      japanese: 'japanese',
      interestsMultiple: 'interests.multiple',
      frontend: 'frontend',
      backend: 'backend',
      mobile: 'mobile',
      ai: 'ai',
      blockchain: 'blockchain',
      formDataOutput: 'form.data.output',

      // 이벤트 로그 텍스트들
      eventLogPlaceholder: 'event.log.placeholder',
      formDataPlaceholder: 'form.data.placeholder',
      noFormData: 'no.form.data',
      selected: 'selected',
      resetCompleted: 'reset.completed',

      // 옵션 텍스트들
      defaultValue: 'default.value',
      option: 'option',
      kiaMotors: 'kia.motors',
      hyundaiMotor: 'hyundai.motor',
      floatingOption: 'floating.option',
      basicOption: 'basic.option',
      lightModeOption: 'light.mode.option',
      darkModeOption: 'dark.mode.option',
      item: 'item',
      detailDescription: 'detail.description',
      short: 'short',
      veryLongOption: 'very.long.option',
      mediumLength: 'medium.length'
    },
    selectedLanguage.value
  );

  // Lit 컴포넌트 초기화 및 DOM 조작 (언어 변경과 무관)
  useVisibleTask$(() => {
    import('@/components/seo-select').then((mod) => {
      if (!customElements.get('seo-select')) {
        customElements.define('seo-select', mod.AgSelect);
      }

      if (!componentState.initialized) {
        // 데모 컴포넌트 설정을 직접 여기에 구현
        
        // 대용량 데이터 셀렉트 설정
        const largeDataSelect = document.getElementById('large-dataset') as CustomSelectElement;
        if (largeDataSelect) {
          largeDataSelect.optionItems = Array.from({ length: 10000 }, (_, i) => ({
            value: `item-${i.toString().padStart(4, '0')}`,
            label: `${t.item} ${i.toString().padStart(4, '0')} - ${t.detailDescription}`
          }));
        }

        // 배열 방식 데모 설정
        const arraySelect = document.getElementById('array-demo') as CustomSelectElement;
        if (arraySelect) {
          arraySelect.optionItems = [
            { value: 'kia', label: t.kiaMotors },
            { value: 'hyundai', label: t.hyundaiMotor },
            { value: 'bmw', label: 'BMW' },
            { value: 'benz', label: 'Mercedes-Benz' }
          ];
          arraySelect.value = 'hyundai';
        }

        // 이벤트 데모 설정
        const eventSelect = document.getElementById('event-demo') as CustomSelectElement;
        if (eventSelect) {
          eventSelect.addEventListener('onSelect', (event: Event) => {
            const { value, label } = (event as CustomEvent).detail;
            const log = document.getElementById('event-log');
            if (log) {
              log.innerHTML += `<div>${t.selected}: ${value} (${label})</div>`;
              log.scrollTop = log.scrollHeight;
            }
          });

          eventSelect.addEventListener('onReset', () => {
            const log = document.getElementById('event-log');
            if (log) {
              log.innerHTML += `<div class="reset">${t.resetCompleted}</div>`;
              log.scrollTop = log.scrollHeight;
            }
          });
        }

        // 다중 선택 데모 설정
        const multiSelect = document.getElementById('multi-demo') as CustomSelectElement;
        if (multiSelect) {
          multiSelect.selectedValues = ['js', 'ts', 'react'];
        }

        // 리셋 비활성화 데모 설정
        const noResetSelect = document.getElementById('no-reset') as CustomSelectElement;
        if (noResetSelect) {
          noResetSelect.showReset = false;
        }

        // 다크 모드 다중 선택 데모 설정
        const darkMultiSelect = document.getElementById('dark-multi-demo') as CustomSelectElement;
        if (darkMultiSelect) {
          darkMultiSelect.selectedValues = ['js', 'react'];
        }

        componentState.initialized = true;
      }
    });
  });

  // 폼 제출 핸들러
  const handleFormSubmit = $((ev: SubmitEvent) => {
    ev.preventDefault();

    const form = ev.target as HTMLFormElement;
    const formData = new FormData(form);

    let result = '';
    for (const [key, value] of formData.entries()) {
      result += `${key}: ${value}\n`;
    }

    const output = form.querySelector('.form-output') as HTMLElement;
    if (output) {
      if (result) {
        output.textContent = result;
        output.style.color = '#f9fafb';
        output.style.fontStyle = 'normal';
      } else {
        output.textContent = t.noFormData;
        output.style.color = '#6b7280';
        output.style.fontStyle = 'italic';
      }
    }
  });

  // 이벤트 로그 클리어 핸들러
  const clearEventLog = $(() => {
    const log = document.getElementById('event-log');
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
              <>
                <div class="demo-item">
                  <h4>{t.slotMethodRecommended}</h4>
                  <div
                    dangerouslySetInnerHTML={`
                      <seo-select name="brand-slot" width="200px">
                        <option value="kia">${t.kiaMotors}</option>
                        <option value="hyundai" selected>${t.hyundaiMotor}</option>
                        <option value="bmw">BMW</option>
                        <option value="benz">Mercedes-Benz</option>
                      </seo-select>
                    `}
                  />
                </div>

                <div class="demo-item">
                  <h4>{t.arrayMethodFallback}</h4>
                  <div
                    dangerouslySetInnerHTML={`<seo-select id="array-demo" name="brand-array" width="200px"></seo-select>`}
                  />
                </div>
              </>
            )
          },

          theme: {
            doc: currentDocs.theme,
            content: (
              <>
                <div class="demo-item">
                  <h4>{t.floatThemeDefault}</h4>
                  <div
                    dangerouslySetInnerHTML={`
                      <seo-select name="float-single" theme="float" width="200px">
                        <option value="option1">${t.floatingOption} 1</option>
                        <option value="option2">${t.floatingOption} 2</option>
                        <option value="option3">${t.floatingOption} 3</option>
                      </seo-select>
                    `}
                  />
                  <p class="demo-note">
                    {t.demoNoteRoundedCorners}
                  </p>
                </div>

                <div class="demo-item">
                  <h4>{t.basicTheme}</h4>
                  <div
                    dangerouslySetInnerHTML={`
                      <seo-select name="basic-single" theme="basic" width="200px">
                        <option value="option1">${t.basicOption} 1</option>
                        <option value="option2">${t.basicOption} 2</option>
                        <option value="option3">${t.basicOption} 3</option>
                      </seo-select>
                    `}
                  />
                  <p class="demo-note">
                    {t.demoNoteTraditionalStyle}
                  </p>
                </div>
              </>
            )
          },

          loading: {
            doc: currentDocs.loading,
            content: (
              <div class="demo-item">
                <h4>{t.continuousLoadingState}</h4>
                <div
                  dangerouslySetInnerHTML={`<seo-select id="loading-demo" name="loading-auto" width="250px"></seo-select>`}
                />
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
                <h4>{t.largeDatasetVirtualScroll}</h4>
                <div
                  dangerouslySetInnerHTML={`<seo-select id="large-dataset" name="large-data" width="300px"></seo-select>`}
                />
                <p class="demo-note">
                  {t.demoNoteLargeDataset}
                </p>
              </div>
            )
          },

          keyboard: {
            doc: currentDocs.keyboard,
            content: (
              <div class="demo-item">
                <h4>{t.keyboardNavigationTest}</h4>
                <div
                  dangerouslySetInnerHTML={`
                    <seo-select name="navigation-test" width="250px">
                      <option value="option1">${t.option} 1</option>
                      <option value="option2">${t.option} 2</option>
                      <option value="option3">${t.option} 3</option>
                      <option value="option4">${t.option} 4</option>
                      <option value="option5">${t.option} 5</option>
                      <option value="option6">${t.option} 6</option>
                      <option value="option7">${t.option} 7</option>
                      <option value="option8">${t.option} 8</option>
                      <option value="option9">${t.option} 9</option>
                      <option value="option10">${t.option} 10</option>
                    </seo-select>
                  `}
                />
                <p class="demo-note">
                  {t.demoNoteKeyboardNavigation}
                </p>
              </div>
            )
          },

          events: {
            doc: currentDocs.events,
            content: (
              <div class="demo-grid">
                <div class="demo-item">
                  <h4>{t.eventGenerationTest}</h4>
                  <div
                    dangerouslySetInnerHTML={`
                      <seo-select id="event-demo" name="event-test" width="200px">
                        <option value="a">${t.option} A</option>
                        <option value="b">${t.option} B</option>
                        <option value="c">${t.option} C</option>
                      </seo-select>
                    `}
                  />
                  <button type="button" onClick$={clearEventLog} class="gradient-btn clear">
                    {t.clearLog}
                  </button>
                </div>

                <div class="demo-item">
                  <h4>{t.eventLog}</h4>
                  <div id="event-log" class="event-log"></div>
                  <p class="demo-note">
                    {t.demoNoteRealtimeEvents}
                  </p>
                </div>
              </div>
            )
          },

          multiple: {
            doc: currentDocs.multiple,
            content: (
              <div class="demo-item">
                <h4>{t.multipleSelectionMode}</h4>
                <div
                  dangerouslySetInnerHTML={`
                    <seo-select id="multi-demo" multiple name="skills" width="400px">
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
                  `}
                />
                <p class="demo-note">
                  {t.demoNoteTagDisplay}
                </p>
              </div>
            )
          },

          darkmode: {
            doc: currentDocs.darkmode,
            content: (
              <div class="demo-grid">
                <div class="demo-item">
                  <h4>{t.lightVsDarkMode}</h4>
                  <div class="flex-group">
                    <div class="comparison-item">
                      <h5>{t.lightModeDefault}</h5>
                      <div
                        dangerouslySetInnerHTML={`
                          <seo-select name="light-mode-demo" theme="float" width="200px">
                            <option value="option1">${t.lightModeOption} 1</option>
                            <option value="option2">${t.lightModeOption} 2</option>
                            <option value="option3">${t.lightModeOption} 3</option>
                          </seo-select>
                        `}
                      />
                    </div>

                    <div class="comparison-item">
                      <h5>{t.darkMode}</h5>
                      <div
                        dangerouslySetInnerHTML={`
                          <seo-select name="dark-mode-demo" theme="float" dark width="200px">
                            <option value="option1">${t.darkModeOption} 1</option>
                            <option value="option2">${t.darkModeOption} 2</option>
                            <option value="option3">${t.darkModeOption} 3</option>
                          </seo-select>
                        `}
                      />
                    </div>
                  </div>
                  <p class="demo-note">
                    {t.demoNoteSameComponent}
                  </p>
                </div>

                <div class="demo-item">
                  <h4>{t.multipleSelectionDarkMode}</h4>
                  <div
                    dangerouslySetInnerHTML={`
                      <seo-select id="dark-multi-demo" multiple name="dark-skills" theme="float" dark width="350px">
                        <option value="js">JavaScript</option>
                        <option value="ts">TypeScript</option>
                        <option value="react">React</option>
                        <option value="vue">Vue.js</option>
                        <option value="node">Node.js</option>
                        <option value="python">Python</option>
                      </seo-select>
                    `}
                  />
                  <p class="demo-note">
                    {t.demoNoteDarkModeInteraction}
                  </p>
                </div>
              </div>
            )
          },

          reset: {
            doc: currentDocs.reset,
            content: (
              <>
                <div class="demo-item">
                  <h4>{t.resetButtonEnabled}</h4>
                  <div
                    dangerouslySetInnerHTML={`
                      <seo-select name="with-reset" width="200px">
                        <option value="default">${t.defaultValue}</option>
                        <option value="option1">${t.option} 1</option>
                        <option value="option2" selected>${t.option} 2</option>
                      </seo-select>
                    `}
                  />
                  <p class="demo-note">
                    {t.demoNoteResetCondition}
                  </p>
                </div>

                <div class="demo-item">
                  <h4>{t.resetButtonDisabled}</h4>
                  <div
                    dangerouslySetInnerHTML={`
                      <seo-select id="no-reset" name="no-reset" width="200px">
                        <option value="default">${t.defaultValue}</option>
                        <option value="option1">${t.option} 1</option>
                        <option value="option2" selected>${t.option} 2</option>
                      </seo-select>
                    `}
                  />
                  <p class="demo-note">
                    {t.demoNoteResetDisabled}
                  </p>
                </div>
              </>
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
                    {t.preferredLanguageRequired}
                    <div
                      dangerouslySetInnerHTML={`
                        <seo-select name="language" required width="200px">
                          <option value="">${t.pleaseSelect}</option>
                          <option value="ko">${t.korean}</option>
                          <option value="en">${t.english}</option>
                          <option value="ja">${t.japanese}</option>
                        </seo-select>
                      `}
                    />
                  </label>
                </div>

                <div class="form-field">
                  <label>
                    {t.interestsMultiple}
                    <div
                      dangerouslySetInnerHTML={`
                        <seo-select name="interests" multiple width="300px">
                          <option value="frontend">${t.frontend}</option>
                          <option value="backend">${t.backend}</option>
                          <option value="mobile">${t.mobile}</option>
                          <option value="ai">${t.ai}</option>
                          <option value="blockchain">${t.blockchain}</option>
                        </seo-select>
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
          },

          styling: {
            doc: currentDocs.styling,
            content: (
              <div class="demo-grid">
                <div class="demo-item">
                  <h4>{t.autoWidthAdjustment}</h4>
                  <div
                    dangerouslySetInnerHTML={`
                      <seo-select name="auto-width">
                        <option value="short">${t.short}</option>
                        <option value="very-long-option">${t.veryLongOption}</option>
                        <option value="medium">${t.mediumLength}</option>
                      </seo-select>
                    `}
                  />
                  <p class="demo-note">
                    {t.demoNoteAutoWidth}
                  </p>
                </div>

                <div class="demo-item">
                  <h4>{t.fixedWidth}</h4>
                  <div
                    dangerouslySetInnerHTML={`
                      <seo-select name="fixed-width" width="150px">
                        <option value="a">${t.option} A</option>
                        <option value="b">${t.option} B</option>
                      </seo-select>
                    `}
                  />
                  <p class="demo-note">
                    {t.demoNoteFixedWidth}
                  </p>
                </div>
              </div>
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
            waitForComponents={['seo-select']}
          >
            {content}
          </DocSection>
        ));
      })()}
    </>
  );
});