export const docs = {
  checkboxBasic: {
    title: '체크박스 기본 사용법',
    description: `
      <code>seo-check-box</code>는 단일 선택 체크박스 컴포넌트입니다.

      **기본 동작**:
      - <strong>checked</strong> 속성으로 초기 선택 상태를 설정합니다
      - <strong>disabled</strong> 속성으로 사용자 입력을 차단할 수 있습니다
      - <strong>label</strong> 속성으로 체크박스 우측에 텍스트를 표시합니다
      - Light DOM을 사용하므로 외부 CSS 스타일링이 가능합니다
    `,
    code: `
      <!-- 기본 체크박스 -->
      <seo-check-box></seo-check-box>

      <!-- 미리 선택된 상태 -->
      <seo-check-box checked></seo-check-box>

      <!-- 라벨이 있는 체크박스 -->
      <seo-check-box label="이용약관에 동의합니다"></seo-check-box>

      <!-- 비활성화된 체크박스 -->
      <seo-check-box checked disabled label="수정 불가 항목"></seo-check-box>
    `,
    lang: 'html'
  },

  checkboxEvents: {
    title: '체크박스 이벤트 처리',
    description: `
      체크박스의 상태 변화를 감지하려면 표준 <strong>change</strong> 이벤트를 사용하세요.

      **주의사항**:
      - 이벤트는 내부 input 요소에서 발생하므로 이벤트 위임을 고려해야 합니다
      - <code>disabled</code> 상태에서는 이벤트가 발생하지 않습니다
      - 프로그래매틱하게 <code>checked</code> 속성을 변경해도 이벤트는 발생하지 않습니다
    `,
    code: `
      <seo-check-box id="agreement" label="개인정보 처리방침 동의"></seo-check-box>

      <script>
        const checkbox = document.getElementById('agreement');

        // change 이벤트 리스너 등록
        checkbox.addEventListener('change', (e) => {
          const isChecked = e.target.checked;
          console.log('체크박스 상태:', isChecked);

          // 체크박스 값 확인
          console.log('폼 값:', checkbox.value); // 'on' 또는 null
        });

        // 프로그래매틱 상태 변경 (이벤트 발생 안함)
        setTimeout(() => {
          checkbox.checked = true;
        }, 2000);
      </script>
    `,
    lang: 'html'
  },

  toggleBasic: {
    title: '토글 기본 사용법',
    description: `
      <code>seo-toggle</code>는 스위치 형태의 boolean 입력 컴포넌트입니다.

      **체크박스와의 차이점**:
      - 시각적으로 스위치 형태로 표시됩니다
      - 기능적으로는 체크박스와 동일하게 동작합니다
      - 폼 제출 시 동일한 방식으로 값이 전송됩니다 (<code>on</code> 또는 <code>null</code>)

      **적합한 사용 사례**: 설정 변경, 기능 활성화/비활성화 등
    `,
    code: `
      <!-- 기본 토글 -->
      <seo-toggle></seo-toggle>

      <!-- 활성화된 토글 -->
      <seo-toggle checked></seo-toggle>

      <!-- 라벨이 있는 토글 -->
      <seo-toggle label="이메일 알림 수신" checked></seo-toggle>

      <!-- 비활성화된 토글 -->
      <seo-toggle disabled label="관리자 전용 기능"></seo-toggle>
    `,
    lang: 'html'
  },

  toggleValidation: {
    title: '토글 유효성 검사',
    description: `
      토글은 <strong>required</strong> 속성을 지원하여 필수 입력을 강제할 수 있습니다.

      **유효성 검사 동작**:
      - <code>required</code> 속성이 있고 <code>checked</code>가 false일 때 유효하지 않음
      - 브라우저 기본 검증 메시지가 표시됩니다: "필수 항목입니다."
      - 폼 제출 시 자동으로 검증되며, 실패 시 제출이 중단됩니다
    `,
    code: `
      <form>
        <seo-toggle
          name="terms"
          label="서비스 이용약관에 동의합니다"
          required>
        </seo-toggle>

        <seo-toggle
          name="privacy"
          label="개인정보 처리방침에 동의합니다"
          required>
        </seo-toggle>

        <button type="submit">가입하기</button>
      </form>

      <script>
        document.querySelector('form').addEventListener('submit', (e) => {
          e.preventDefault();

          const formData = new FormData(e.target);
          console.log('약관 동의:', formData.get('terms')); // 'on' 또는 null
          console.log('개인정보 동의:', formData.get('privacy'));
        });
      </script>
    `,
    lang: 'html'
  },

  radioBasic: {
    title: '라디오 기본 사용법',
    description: `
      <code>seo-radio</code>는 여러 선택지 중 하나만 선택할 수 있는 라디오 그룹 컴포넌트입니다.

      **설정 방법**:
      - <strong>options</strong> 속성에 <code>{ label, value }</code> 형태의 배열을 전달
      - <strong>value</strong> 속성으로 초기 선택값을 지정
      - <strong>name</strong> 속성으로 폼 필드명을 설정

      **중요한 제약사항**:
      - HTML 속성으로 options를 설정할 수 없습니다 (JavaScript 필수)
      - 빈 options 배열일 때의 렌더링 동작이 명확하지 않습니다
    `,
    code: `
      <seo-radio id="payment-method" name="payment"></seo-radio>

      <script>
        const radio = document.getElementById('payment-method');

        // options 설정 (필수)
        radio.options = [
          { label: '신용카드', value: 'card' },
          { label: '계좌이체', value: 'bank' },
          { label: '무통장입금', value: 'deposit' },
          { label: '휴대폰 결제', value: 'mobile' }
        ];

        // 초기 선택값 설정
        radio.value = 'card';
      </script>
    `,
    lang: 'html'
  },

  radioEvents: {
    title: '라디오 이벤트 처리',
    description: `
      라디오 그룹의 선택 변화를 감지하려면 <strong>change</strong> 이벤트를 사용합니다.

      **이벤트 동작**:
      - 내부 input 요소에서 change 이벤트가 발생합니다
      - 컴포넌트의 <code>value</code> 속성이 자동으로 업데이트됩니다
      - <code>disabled</code> 상태에서는 이벤트가 발생하지 않습니다
    `,
    code: `
      <seo-radio id="subscription-plan" name="plan"></seo-radio>

      <script>
        const planRadio = document.getElementById('subscription-plan');

        planRadio.options = [
          { label: '무료 플랜', value: 'free' },
          { label: '베이직 플랜 (월 9,900원)', value: 'basic' },
          { label: '프리미엄 플랜 (월 19,900원)', value: 'premium' }
        ];

        // 선택 변화 감지
        planRadio.addEventListener('change', (e) => {
          const selectedValue = e.target.value;
          console.log('선택된 플랜:', selectedValue);
          console.log('컴포넌트 값:', planRadio.value);

          // 선택된 옵션의 전체 정보 찾기
          const selectedOption = planRadio.options.find(opt => opt.value === selectedValue);
          console.log('선택된 옵션:', selectedOption);
        });
      </script>
    `,
    lang: 'html'
  },

  radioDisabled: {
    title: '라디오 비활성화',
    description: `
      라디오 그룹 전체를 <strong>disabled</strong> 속성으로 비활성화할 수 있습니다.

      **비활성화 동작**:
      - 모든 라디오 버튼이 선택 불가능해집니다
      - 시각적으로 비활성화 상태로 표시됩니다
      - 이벤트가 발생하지 않습니다

      **제약사항**: 개별 옵션을 선택적으로 비활성화하는 기능은 없습니다
    `,
    code: `
      <seo-radio id="region-selector" name="region" disabled></seo-radio>

      <script>
        const regionRadio = document.getElementById('region-selector');

        regionRadio.options = [
          { label: '서울', value: 'seoul' },
          { label: '부산', value: 'busan' },
          { label: '대구', value: 'daegu' },
          { label: '인천', value: 'incheon' }
        ];

        regionRadio.value = 'seoul'; // 선택되지만 변경 불가
      </script>
    `,
    lang: 'html'
  },

  formIntegration: {
    title: '폼 통합 및 제출',
    description: `
      모든 컴포넌트는 <strong>formAssociated = true</strong>로 설정되어 표준 HTML 폼과 호환됩니다.

      **폼 제출 시 값**:
      - **체크박스/토글**: <code>checked</code>일 때 <code>'on'</code>, 아닐 때 <code>null</code> (제출 안됨)
      - **라디오**: 선택된 옵션의 <code>value</code> 문자열

      **주의사항**:
      - 체크되지 않은 체크박스/토글은 FormData에 포함되지 않습니다
      - 라디오에서 아무것도 선택하지 않으면 <code>null</code>이 제출됩니다
    `,
    code: `
      <form id="user-preferences">
        <fieldset>
          <legend>알림 설정</legend>
          <seo-check-box name="email_notifications" label="이메일 알림" checked></seo-check-box>
          <seo-toggle name="push_notifications" label="푸시 알림"></seo-toggle>
        </fieldset>

        <fieldset>
          <legend>테마 선택</legend>
          <seo-radio id="theme-selector" name="theme"></seo-radio>
        </fieldset>

        <fieldset>
          <legend>언어 설정</legend>
          <seo-radio id="language-selector" name="language"></seo-radio>
        </fieldset>

        <button type="submit">설정 저장</button>
      </form>

      <script>
        // 테마 라디오 설정
        const themeRadio = document.getElementById('theme-selector');
        themeRadio.options = [
          { label: '밝은 테마', value: 'light' },
          { label: '어두운 테마', value: 'dark' },
          { label: '시스템 기본값', value: 'auto' }
        ];
        themeRadio.value = 'light';

        // 언어 라디오 설정
        const langRadio = document.getElementById('language-selector');
        langRadio.options = [
          { label: '한국어', value: 'ko' },
          { label: 'English', value: 'en' },
          { label: '日本語', value: 'ja' }
        ];
        langRadio.value = 'ko';

        // 폼 제출 처리
        document.getElementById('user-preferences').addEventListener('submit', (e) => {
          e.preventDefault();

          const formData = new FormData(e.target);
          const preferences = {};

          for (const [key, value] of formData.entries()) {
            preferences[key] = value;
          }

          console.log('사용자 설정:', preferences);
          // 예상 출력:
          // {
          //   email_notifications: "on",  // 체크된 경우만 포함
          //   theme: "light",
          //   language: "ko"
          // }
          // push_notifications는 체크되지 않아서 포함되지 않음
        });
      </script>
    `,
    lang: 'html'
  },

  validation: {
    title: '유효성 검사 및 접근성',
    description: `
      컴포넌트들의 유효성 검사와 접근성 기능에 대한 설명입니다.

      **유효성 검사**:
      - 체크박스: <code>required</code> 속성은 지원하지만 코드에서 사용되지 않음
      - 토글: <code>required</code> 지원, "필수 항목입니다." 메시지 표시
      - 라디오: 필수 검증 기능 없음 (추가 구현 필요)

      **접근성**:
      - 모든 컴포넌트에서 <code>focus()</code> 메서드 지원
      - 라벨 클릭 시 해당 입력 요소에 포커스 이동
      - <code>tabindex</code>를 통한 키보드 네비게이션 지원
    `,
    code: `
      <form id="validation-form">
        <!-- 체크박스 - required 속성이 있지만 실제로는 검증되지 않음 -->
        <seo-check-box
          name="agree_terms"
          label="이용약관 동의 (필수)"
          required>
        </seo-check-box>

        <!-- 토글 - required 검증 작동 -->
        <seo-toggle
          name="agree_privacy"
          label="개인정보 처리방침 동의 (필수)"
          required>
        </seo-toggle>

        <!-- 라디오 - required 검증 기능 없음 -->
        <seo-radio id="age-group" name="age_group"></seo-radio>

        <button type="submit">가입하기</button>
      </form>

      <script>
        const ageRadio = document.getElementById('age-group');
        ageRadio.options = [
          { label: '10대', value: 'teens' },
          { label: '20대', value: 'twenties' },
          { label: '30대', value: 'thirties' },
          { label: '40대 이상', value: 'forties_plus' }
        ];

        document.getElementById('validation-form').addEventListener('submit', (e) => {
          e.preventDefault();

          // 수동으로 라디오 검증 (컴포넌트에서 지원하지 않음)
          if (!ageRadio.value) {
            alert('연령대를 선택해주세요.');
            ageRadio.focus();
            return;
          }

          console.log('폼 제출 성공');
        });
      </script>
    `,
    lang: 'html'
  },

  dynamicUpdate: {
    title: '동적 데이터 업데이트',
    description: `
      컴포넌트의 속성을 JavaScript로 동적으로 변경하는 방법입니다.

      **상태 변경**:
      - 모든 boolean 속성은 JavaScript로만 변경 가능합니다
      - 라디오의 <code>options</code>는 배열 재할당으로만 업데이트됩니다
      - 속성 변경 시 컴포넌트가 자동으로 리렌더링됩니다

      **성능 고려사항**:
      - 라디오 options 변경 시 전체 리렌더링이 발생합니다
      - 대량의 옵션이 있을 때 성능 저하 가능성이 있습니다
    `,
    code: `
      <div class="control-panel">
        <button id="toggle-checkbox">체크박스 토글</button>
        <button id="toggle-disabled">비활성화 토글</button>
        <button id="update-radio">라디오 옵션 업데이트</button>
        <button id="reset-all">모두 리셋</button>
      </div>

      <seo-check-box id="dynamic-checkbox" label="동적 체크박스"></seo-check-box>
      <seo-toggle id="dynamic-toggle" label="동적 토글"></seo-toggle>
      <seo-radio id="dynamic-radio" name="dynamic"></seo-radio>

      <script>
        const checkbox = document.getElementById('dynamic-checkbox');
        const toggle = document.getElementById('dynamic-toggle');
        const radio = document.getElementById('dynamic-radio');

        // 초기 라디오 옵션 설정
        radio.options = [
          { label: '초기 옵션 1', value: 'init1' },
          { label: '초기 옵션 2', value: 'init2' }
        ];

        // 체크박스 상태 토글
        document.getElementById('toggle-checkbox').addEventListener('click', () => {
          checkbox.checked = !checkbox.checked;
        });

        // 모든 컴포넌트 비활성화 토글
        document.getElementById('toggle-disabled').addEventListener('click', () => {
          const isDisabled = !checkbox.disabled;
          checkbox.disabled = isDisabled;
          toggle.disabled = isDisabled;
          radio.disabled = isDisabled;
        });

        // 라디오 옵션 동적 업데이트
        document.getElementById('update-radio').addEventListener('click', () => {
          const randomOptions = [
            { label: \`옵션 A-\${Math.floor(Math.random() * 100)}\`, value: 'a' },
            { label: \`옵션 B-\${Math.floor(Math.random() * 100)}\`, value: 'b' },
            { label: \`옵션 C-\${Math.floor(Math.random() * 100)}\`, value: 'c' }
          ];
          radio.options = randomOptions;
          radio.value = 'a'; // 첫 번째 옵션 선택
        });

        // 모든 컴포넌트 리셋
        document.getElementById('reset-all').addEventListener('click', () => {
          checkbox.checked = false;
          checkbox.disabled = false;
          toggle.checked = false;
          toggle.disabled = false;
          radio.options = [
            { label: '기본 옵션 1', value: 'default1' },
            { label: '기본 옵션 2', value: 'default2' }
          ];
          radio.value = null;
          radio.disabled = false;
        });
      </script>
    `,
    lang: 'html'
  }
};