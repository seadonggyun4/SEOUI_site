import { component$, $, useVisibleTask$ } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { docs } from './docs';

interface CustomInputElement extends HTMLElement {
  checked?: boolean;
  disabled?: boolean;
  value?: string | null;
  options?: { label: string; value: string }[];
}

export default component$(() => {
  useVisibleTask$(() => {
    // Lit 컴포넌트들을 동적으로 로드하고 등록
    Promise.all([
      import('@/components/ag-check-box'),
      import('@/components/ag-toggle'),
      import('@/components/ag-radio')
    ]).then(([checkboxMod, toggleMod, radioMod]) => {
      if (!customElements.get('ag-check-box')) {
        customElements.define('ag-check-box', checkboxMod.CheckBox);
      }
      if (!customElements.get('ag-toggle')) {
        customElements.define('ag-toggle', toggleMod.AgToggle);
      }
      if (!customElements.get('ag-radio')) {
        customElements.define('ag-radio', radioMod.AgRadio);
      }

      // 이벤트 처리 예시를 위한 설정
      const eventCheckbox = document.getElementById('agreement') as CustomInputElement;
      if (eventCheckbox) {
        eventCheckbox.addEventListener('change', (e: Event) => {
          const target = e.target as HTMLInputElement;
          const log = document.getElementById('checkbox-event-log');
          if (log) {
            log.innerHTML += `<div>체크박스 상태: ${target.checked ? '선택됨' : '해제됨'}</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });
      }

      // 라디오 이벤트 예시 설정
      const planRadio = document.getElementById('subscription-plan') as CustomInputElement;
      if (planRadio) {
        planRadio.options = [
          { label: '무료 플랜', value: 'free' },
          { label: '베이직 플랜 (월 9,900원)', value: 'basic' },
          { label: '프리미엄 플랜 (월 19,900원)', value: 'premium' }
        ];

        planRadio.addEventListener('change', (e: Event) => {
          const target = e.target as HTMLInputElement;
          const log = document.getElementById('radio-event-log');
          if (log) {
            const selectedOption = planRadio.options?.find(opt => opt.value === target.value);
            log.innerHTML += `<div>선택된 플랜: ${selectedOption?.label} (${target.value})</div>`;
            log.scrollTop = log.scrollHeight;
          }
        });
      }

      // 결제 방법 라디오 설정
      const paymentRadio = document.getElementById('payment-method') as CustomInputElement;
      if (paymentRadio) {
        paymentRadio.options = [
          { label: '신용카드', value: 'card' },
          { label: '계좌이체', value: 'bank' },
          { label: '무통장입금', value: 'deposit' },
          { label: '휴대폰 결제', value: 'mobile' }
        ];
        paymentRadio.value = 'card';
      }

      const regionRadio = document.getElementById('region-selector') as CustomInputElement;
      if (regionRadio) {
        regionRadio.options = [
          { label: '서울', value: 'seoul' },
          { label: '부산', value: 'busan' },
          { label: '대구', value: 'daegu' },
          { label: '인천', value: 'incheon' }
        ];
        regionRadio.value = 'seoul';
        regionRadio.disabled = true;
      }

      // 폼 통합 예시 라디오 설정
      const themeRadio = document.getElementById('theme-selector') as CustomInputElement;
      if (themeRadio) {
        themeRadio.options = [
          { label: '밝은 테마', value: 'light' },
          { label: '어두운 테마', value: 'dark' },
          { label: '시스템 기본값', value: 'auto' }
        ];
        themeRadio.value = 'light';
      }

      const langRadio = document.getElementById('language-selector') as CustomInputElement;
      if (langRadio) {
        langRadio.options = [
          { label: '한국어', value: 'ko' },
          { label: 'English', value: 'en' },
          { label: '日本語', value: 'ja' }
        ];
        langRadio.value = 'ko';
      }

      // 유효성 검사 예시 라디오 설정
      const ageRadio = document.getElementById('age-group') as CustomInputElement;
      if (ageRadio) {
        ageRadio.options = [
          { label: '10대', value: 'teens' },
          { label: '20대', value: 'twenties' },
          { label: '30대', value: 'thirties' },
          { label: '40대 이상', value: 'forties_plus' }
        ];
      }

      // 동적 업데이트 예시 초기 설정
      const dynamicRadio = document.getElementById('dynamic-radio') as CustomInputElement;
      if (dynamicRadio) {
        dynamicRadio.options = [
          { label: '초기 옵션 1', value: 'init1' },
          { label: '초기 옵션 2', value: 'init2' }
        ];
      }
    });
  });

  // 타입 안전한 폼 데이터 처리
  const handleFormSubmit = $((ev: SubmitEvent) => {
    ev.preventDefault();

    const form = ev.target as HTMLFormElement;
    const formData = new FormData(form);
    const preferences: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      preferences[key] = value as string;
    }

    const output = form.querySelector('.form-output') as HTMLElement;
    if (output) {
      output.textContent = JSON.stringify(preferences, null, 2);
    }
  });

  const handleValidationSubmit = $((ev: SubmitEvent) => {
    ev.preventDefault();

    const form = ev.target as HTMLFormElement;
    const ageRadio = form.querySelector('#age-group') as CustomInputElement;

    // 수동으로 라디오 검증 (컴포넌트에서 지원하지 않음)
    if (!ageRadio?.value) {
      alert('연령대를 선택해주세요.');
      ageRadio?.focus();
      return;
    }

    alert('폼 제출 성공!');
  });

  const clearEventLogs = $(() => {
    const checkboxLog = document.getElementById('checkbox-event-log');
    const radioLog = document.getElementById('radio-event-log');
    if (checkboxLog) checkboxLog.innerHTML = '';
    if (radioLog) radioLog.innerHTML = '';
  });

  const toggleCheckbox = $(() => {
    const checkbox = document.getElementById('dynamic-checkbox') as CustomInputElement;
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  });

  const toggleDisabled = $(() => {
    const checkbox = document.getElementById('dynamic-checkbox') as CustomInputElement;
    const toggle = document.getElementById('dynamic-toggle') as CustomInputElement;
    const radio = document.getElementById('dynamic-radio') as CustomInputElement;

    if (checkbox && toggle && radio) {
      const isDisabled = !checkbox.disabled;
      checkbox.disabled = isDisabled;
      toggle.disabled = isDisabled;
      radio.disabled = isDisabled;
    }
  });

  const updateRadioOptions = $(() => {
    const radio = document.getElementById('dynamic-radio') as CustomInputElement;
    if (radio) {
      const randomOptions = [
        { label: `옵션 A-${Math.floor(Math.random() * 100)}`, value: 'a' },
        { label: `옵션 B-${Math.floor(Math.random() * 100)}`, value: 'b' },
        { label: `옵션 C-${Math.floor(Math.random() * 100)}`, value: 'c' }
      ];
      radio.options = randomOptions;
      radio.value = 'a';
    }
  });

  const resetAll = $(() => {
    const checkbox = document.getElementById('dynamic-checkbox') as CustomInputElement;
    const toggle = document.getElementById('dynamic-toggle') as CustomInputElement;
    const radio = document.getElementById('dynamic-radio') as CustomInputElement;

    if (checkbox) {
      checkbox.checked = false;
      checkbox.disabled = false;
    }
    if (toggle) {
      toggle.checked = false;
      toggle.disabled = false;
    }
    if (radio) {
      radio.options = [
        { label: '기본 옵션 1', value: 'default1' },
        { label: '기본 옵션 2', value: 'default2' }
      ];
      radio.value = null;
      radio.disabled = false;
    }
  });

  return (
    <>
      <DocSection {...docs.checkboxBasic}>
        <div class="demo-item">
          <h4>기본 체크박스</h4>
          <div dangerouslySetInnerHTML={`<ag-check-box></ag-check-box>`} />
        </div>

        <div class="demo-item">
          <h4>미리 선택된 상태</h4>
          <div dangerouslySetInnerHTML={`<ag-check-box checked></ag-check-box>`} />
        </div>

        <div class="demo-item">
          <h4>라벨이 있는 체크박스</h4>
          <div dangerouslySetInnerHTML={`<ag-check-box label="이용약관에 동의합니다"></ag-check-box>`} />
        </div>

        <div class="demo-item">
          <h4>비활성화된 체크박스</h4>
          <div dangerouslySetInnerHTML={`<ag-check-box checked disabled label="수정 불가 항목"></ag-check-box>`} />
        </div>
      </DocSection>

      <DocSection {...docs.checkboxEvents}>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>이벤트 테스트</h4>
            <div dangerouslySetInnerHTML={`<ag-check-box id="agreement" label="개인정보 처리방침 동의"></ag-check-box>`} />
            <button type="button" onClick$={clearEventLogs} class="gradient-btn clear">
              로그 지우기
            </button>
          </div>

          <div class="demo-item">
            <h4>이벤트 로그</h4>
            <div id="checkbox-event-log" class="event-log"></div>
            <p class="demo-note">
              ✅ 체크박스를 클릭하면 change 이벤트가 발생합니다
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection {...docs.toggleBasic}>
        <div class="demo-item">
          <h4>기본 토글</h4>
          <div dangerouslySetInnerHTML={`<ag-toggle></ag-toggle>`} />
        </div>

        <div class="demo-item">
          <h4>활성화된 토글</h4>
          <div dangerouslySetInnerHTML={`<ag-toggle checked></ag-toggle>`} />
        </div>

        <div class="demo-item">
          <h4>라벨이 있는 토글</h4>
          <div dangerouslySetInnerHTML={`<ag-toggle label="이메일 알림 수신" checked></ag-toggle>`} />
        </div>

        <div class="demo-item">
          <h4>비활성화된 토글</h4>
          <div dangerouslySetInnerHTML={`<ag-toggle disabled label="관리자 전용 기능"></ag-toggle>`} />
        </div>
      </DocSection>

      <DocSection {...docs.toggleValidation}>
        <form preventdefault:submit onSubmit$={(e) => {
          e.preventDefault();
          alert('약관 동의 완료!');
        }} class="demo-form">
          <div class="form-field">
            <div dangerouslySetInnerHTML={`
              <ag-toggle
                name="terms"
                label="서비스 이용약관에 동의합니다"
                required>
              </ag-toggle>
            `} />
          </div>

          <div class="form-field">
            <div dangerouslySetInnerHTML={`
              <ag-toggle
                name="privacy"
                label="개인정보 처리방침에 동의합니다"
                required>
              </ag-toggle>
            `} />
          </div>

          <button type="submit" class="gradient-btn submit">가입하기</button>
        </form>
      </DocSection>

      <DocSection {...docs.radioBasic}>
        <div class="demo-item">
          <h4>결제 방법 선택</h4>
          <div dangerouslySetInnerHTML={`<ag-radio id="payment-method" name="payment"></ag-radio>`} />
          <p class="demo-note">
            💳 JavaScript를 통해 options 배열을 설정해야 합니다
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.radioEvents}>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>구독 플랜 선택</h4>
            <div dangerouslySetInnerHTML={`<ag-radio id="subscription-plan" name="plan"></ag-radio>`} />
          </div>

          <div class="demo-item">
            <h4>선택 이벤트 로그</h4>
            <div id="radio-event-log" class="event-log"></div>
            <p class="demo-note">
              📋 플랜을 선택하면 이벤트가 발생합니다
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection {...docs.radioDisabled}>
        <div class="demo-item">
          <h4>비활성화된 라디오 그룹</h4>
          <div dangerouslySetInnerHTML={`<ag-radio id="region-selector" name="region" disabled></ag-radio>`} />
          <p class="demo-note">
            🚫 전체 라디오 그룹이 비활성화되어 선택할 수 없습니다
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.formIntegration}>
        <form
          preventdefault:submit
          onSubmit$={handleFormSubmit}
          id="user-preferences"
          class="demo-form"
        >
          <fieldset>
            <legend>알림 설정</legend>
            <div dangerouslySetInnerHTML={`<ag-check-box name="email_notifications" label="이메일 알림" checked></ag-check-box>`} />
            <div dangerouslySetInnerHTML={`<ag-toggle name="push_notifications" label="푸시 알림"></ag-toggle>`} />
          </fieldset>

          <fieldset>
            <legend>테마 선택</legend>
            <div dangerouslySetInnerHTML={`<ag-radio id="theme-selector" name="theme"></ag-radio>`} />
          </fieldset>

          <fieldset>
            <legend>언어 설정</legend>
            <div dangerouslySetInnerHTML={`<ag-radio id="language-selector" name="language"></ag-radio>`} />
          </fieldset>

          <button type="submit" class="gradient-btn submit">설정 저장</button>

          <div class="form-output-container">
            <h4>폼 데이터 출력:</h4>
            <pre class="form-output"></pre>
          </div>
        </form>
      </DocSection>

      <DocSection {...docs.validation}>
        <form
          preventdefault:submit
          onSubmit$={handleValidationSubmit}
          id="validation-form"
          class="demo-form"
        >
          <div class="form-field">
            <div dangerouslySetInnerHTML={`
              <ag-check-box
                name="agree_terms"
                label="이용약관 동의 (필수)"
                required>
              </ag-check-box>
            `} />
            <p class="demo-note">
              ⚠️ required 속성이 있지만 실제로는 검증되지 않습니다
            </p>
          </div>

          <div class="form-field">
            <div dangerouslySetInnerHTML={`
              <ag-toggle
                name="agree_privacy"
                label="개인정보 처리방침 동의 (필수)"
                required>
              </ag-toggle>
            `} />
            <p class="demo-note">
              ✅ required 검증이 정상 작동합니다
            </p>
          </div>

          <div class="form-field">
            <div dangerouslySetInnerHTML={`<ag-radio id="age-group" name="age_group"></ag-radio>`} />
            <p class="demo-note">
              🔧 필수 검증을 수동으로 구현해야 합니다
            </p>
          </div>

          <button type="submit" class="gradient-btn submit">가입하기</button>
        </form>
      </DocSection>

      <DocSection {...docs.dynamicUpdate}>


        <div class="demo-grid">
          <div class="demo-item">
            <h4>동적 체크박스</h4>
            <div dangerouslySetInnerHTML={`<ag-check-box id="dynamic-checkbox" label="동적 체크박스"></ag-check-box>`} />
          </div>

          <div class="demo-item">
            <h4>동적 토글</h4>
            <div dangerouslySetInnerHTML={`<ag-toggle id="dynamic-toggle" label="동적 토글"></ag-toggle>`} />
          </div>

          <div class="demo-item">
            <h4>동적 라디오</h4>
            <div dangerouslySetInnerHTML={`<ag-radio id="dynamic-radio" name="dynamic"></ag-radio>`} />
          </div>

          <div class="button-group">
            <button type="button" onClick$={toggleCheckbox} class="gradient-btn">
              체크박스 토글
            </button>
            <button type="button" onClick$={toggleDisabled} class="gradient-btn">
              비활성화 토글
            </button>
            <button type="button" onClick$={updateRadioOptions} class="gradient-btn">
              라디오 옵션 업데이트
            </button>
            <button type="button" onClick$={resetAll} class="gradient-btn clear">
              모두 리셋
            </button>
          </div>
        </div>
      </DocSection>
    </>
  );
});