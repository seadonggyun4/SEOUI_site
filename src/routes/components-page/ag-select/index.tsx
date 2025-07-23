import { component$, $, useVisibleTask$ } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { docs } from './docs';
import './style.scss';

interface CustomSelectElement extends HTMLElement {
  optionItems?: { value: string; label: string }[];
  value?: string;
  selectedValues?: string[];
  multiple?: boolean;
  resetToDefaultValue?: () => void;
}

export default component$(() => {
  useVisibleTask$(() => {
    import('@/components/ag-select').then((mod) => {
      if (!customElements.get('ag-select')) {
        customElements.define('ag-select', mod.AgSelect);
      }

      // 대용량 데이터 셀렉트 설정
      const largeDataSelect = document.getElementById('large-dataset') as CustomSelectElement;
      if (largeDataSelect) {
        largeDataSelect.optionItems = Array.from({ length: 10000 }, (_, i) => ({
          value: `item-${i.toString().padStart(4, '0')}`,
          label: `아이템 ${i.toString().padStart(4, '0')} - 상세 설명 텍스트`
        }));
      }

      // 이벤트 데모 설정
      const eventSelect = document.getElementById('event-demo') as CustomSelectElement;
      if (eventSelect) {
        eventSelect.addEventListener('onSelect', (e: Event) => {
          const { value, label } = (e as CustomEvent).detail;
          const log = document.getElementById('event-log');
          if (log) {
            log.innerHTML += `<div>선택됨: ${value} (${label})</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });

        eventSelect.addEventListener('onReset', (e: Event) => {
          const log = document.getElementById('event-log');
          if (log) {
            log.innerHTML += `<div class="reset">리셋됨</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });
      }

      // 다중 선택 데모 설정
      const multiSelect = document.getElementById('multi-demo') as CustomSelectElement;
      if (multiSelect) {
        // 초기 선택값 설정
        multiSelect.selectedValues = ['js', 'ts', 'react'];

        multiSelect.addEventListener('onSelect', (e: Event) => {
          const { value, label } = (e as CustomEvent).detail;
          const log = document.getElementById('multi-log');
          if (log) {
            log.innerHTML += `<div>추가 선택: ${value} (${label})</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });

        multiSelect.addEventListener('onDeselect', (e: Event) => {
          const { value, label } = (e as CustomEvent).detail;
          const log = document.getElementById('multi-log');
          if (log) {
            log.innerHTML += `<div class="deselect">선택 해제: ${value} (${label})</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });
      }

      // 배열 방식 데모 설정
      const arraySelect = document.getElementById('array-demo') as CustomSelectElement;
      if (arraySelect) {
        arraySelect.optionItems = [
          { value: 'kia', label: '기아자동차' },
          { value: 'hyundai', label: '현대자동차' },
          { value: 'bmw', label: 'BMW' },
          { value: 'benz', label: 'Mercedes-Benz' }
        ];
        arraySelect.value = 'hyundai';
      }
    });
  });

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
      output.textContent = result || '(폼 데이터 없음)';
    }
  });

  const handleResetDemo = $(() => {
    const resetSelect = document.getElementById('reset-demo') as CustomSelectElement;
    if (resetSelect && resetSelect.resetToDefaultValue) {
      resetSelect.resetToDefaultValue();
    }
  });

  const clearEventLog = $(() => {
    const log = document.getElementById('event-log');
    if (log) log.innerHTML = '';
  });

  const clearMultiLog = $(() => {
    const log = document.getElementById('multi-log');
    if (log) log.innerHTML = '';
  });

  return (
    <>
      <DocSection {...docs.basic}>
        <div class="demo-item">
          <h4>Slot 방식 (권장)</h4>
          <div
            dangerouslySetInnerHTML={`
              <ag-select name="brand-slot" width="200px">
                <option value="kia">기아자동차</option>
                <option value="hyundai" selected>현대자동차</option>
                <option value="bmw">BMW</option>
                <option value="benz">Mercedes-Benz</option>
              </ag-select>
            `}
          />
        </div>

        <div class="demo-item">
          <h4>배열 방식 (Fallback)</h4>
          <div
            dangerouslySetInnerHTML={`<ag-select id="array-demo" name="brand-array" width="200px"></ag-select>`}
          />
        </div>
      </DocSection>

      <DocSection {...docs.virtual}>
        <div class="demo-item">
          <h4>10,000개 옵션 - 가상 스크롤링</h4>
          <div
            dangerouslySetInnerHTML={`<ag-select id="large-dataset" name="large-data" width="300px"></ag-select>`}
          />
          <p class="demo-note">
            ⚡ 대용량 데이터도 성능 저하 없이 즉시 렌더링됩니다
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.keyboard}>
        <div class="demo-item">
          <h4>키보드 네비게이션 테스트</h4>
          <div
            dangerouslySetInnerHTML={`
              <ag-select name="navigation-test" width="250px">
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
              </ag-select>
            `}
          />
          <p class="demo-note">
            Tab으로 포커스 이동 후 ↑↓ 키보드로 조작해보세요
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.events}>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>이벤트 발생 테스트</h4>
            <div
              dangerouslySetInnerHTML={`
                <ag-select id="event-demo" name="event-test" width="200px">
                  <option value="a">옵션 A</option>
                  <option value="b">옵션 B</option>
                  <option value="c">옵션 C</option>
                </ag-select>
              `}
            />
            <button type="button" onClick$={clearEventLog} class="clear-btn">
              로그 지우기
            </button>
          </div>

          <div class="demo-item">
            <h4>이벤트 로그</h4>
            <div id="event-log" class="event-log"></div>
          </div>
        </div>
      </DocSection>

      <DocSection {...docs.multiple}>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>다중 선택 모드</h4>
            <div
              dangerouslySetInnerHTML={`
                <ag-select id="multi-demo" multiple name="skills" width="400px">
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
                </ag-select>
              `}
            />
            <button type="button" onClick$={clearMultiLog} class="clear-btn">
              로그 지우기
            </button>
          </div>

          <div class="demo-item">
            <h4>다중 선택 로그</h4>
            <div id="multi-log" class="event-log"></div>
          </div>
        </div>
      </DocSection>

      <DocSection {...docs.reset}>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>리셋 버튼 비활성화</h4>
            <div
              dangerouslySetInnerHTML={`
                <ag-select name="no-reset" width="200px">
                  <option value="default">기본값</option>
                  <option value="option1">옵션 1</option>
                  <option value="option2">옵션 2</option>
                </ag-select>
              `}
            />
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
              선호 언어 (필수):
              <div
                dangerouslySetInnerHTML={`
                  <ag-select name="language" required width="200px">
                    <option value="">선택해주세요</option>
                    <option value="ko">한국어</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                  </ag-select>
                `}
              />
            </label>
          </div>

          <div class="form-field">
            <label>
              관심 기술 (다중 선택):
              <div
                dangerouslySetInnerHTML={`
                  <ag-select name="interests" multiple width="300px">
                    <option value="frontend">프론트엔드</option>
                    <option value="backend">백엔드</option>
                    <option value="mobile">모바일</option>
                    <option value="ai">인공지능</option>
                    <option value="blockchain">블록체인</option>
                  </ag-select>
                `}
              />
            </label>
          </div>

          <button type="submit" class="submit-btn">제출</button>

          <div class="form-output-container">
            <h4>폼 데이터 출력:</h4>
            <pre class="form-output"></pre>
          </div>
        </form>
      </DocSection>

      <DocSection {...docs.styling}>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>자동 너비 조절</h4>
            <div
              dangerouslySetInnerHTML={`
                <ag-select name="auto-width">
                  <option value="short">짧음</option>
                  <option value="very-long-option">매우 긴 옵션 텍스트입니다</option>
                  <option value="medium">중간 길이</option>
                </ag-select>
              `}
            />
          </div>

          <div class="demo-item">
            <h4>고정 너비</h4>
            <div
              dangerouslySetInnerHTML={`
                <ag-select name="fixed-width" width="150px">
                  <option value="a">옵션 A</option>
                  <option value="b">옵션 B</option>
                </ag-select>
              `}
            />
          </div>
        </div>
      </DocSection>
    </>
  );
});