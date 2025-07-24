import { component$, $, useVisibleTask$ } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { docs } from './docs';
import { openDatePicker as _openDatePicker } from '@/utils/date-picker';
import { AgDatepickerHost } from './AgDatepickerHost';

interface DatepickerElement extends HTMLElement {
  date: string;
  time: string;
  criteriaDate: string | null;
  minDate: string | null;
  maxDate: string | null;
  open: (rect: DOMRect, triggerEl?: HTMLElement, showTime?: boolean) => void;
  close: () => Promise<void>;
  setAttribute: (name: string, value: string) => void;
  removeAttribute: (name: string) => void;
}

interface OnChangeEventDetail {
  date: string;
  time: string;
  id: string;
  name: string;
}

const openDatePicker = _openDatePicker as (params: {
  target: HTMLInputElement;
  datepicker: DatepickerElement;
  startTargetId?: string;
  endTargetId?: string;
}) => void;

export default component$(() => {
  useVisibleTask$(() => {
    const datepicker = document.getElementById('ag-datepicker-main') as DatepickerElement | null;
    if (!datepicker) return;

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // 기본 사용법 데모
    const basicInput = document.getElementById('basic-input') as HTMLInputElement;
    if (basicInput) {
      basicInput.value = `${today}T10:30`;
      basicInput.addEventListener('click', () => {
        openDatePicker({ target: basicInput, datepicker });
      });
    }

    // 날짜만 선택 데모
    const dateOnlyInput = document.getElementById('date-only-input') as HTMLInputElement;
    if (dateOnlyInput) {
      dateOnlyInput.value = today;
      dateOnlyInput.addEventListener('click', () => {
        openDatePicker({ target: dateOnlyInput, datepicker });
      });
    }

    // 제약 조건 데모
    const constrainedInput = document.getElementById('constrained-input') as HTMLInputElement;
    if (constrainedInput) {
      constrainedInput.value = `${today}T14:00`;
      constrainedInput.addEventListener('click', () => {
        // 오늘부터 30일 후까지만 선택 가능
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);

        datepicker.setAttribute('min-date', today);
        datepicker.setAttribute('max-date', maxDate.toISOString().split('T')[0]);

        openDatePicker({ target: constrainedInput, datepicker });
      });
    }

    // 기준일 표시 데모
    const startDateInput = document.getElementById('start-date') as HTMLInputElement;
    const endDateInput = document.getElementById('end-date') as HTMLInputElement;

    if (startDateInput && endDateInput) {
      startDateInput.value = today;
      endDateInput.value = tomorrowStr;

      startDateInput.addEventListener('click', () => {
        datepicker.removeAttribute('criteria-date');
        openDatePicker({
          target: startDateInput,
          datepicker,
          startTargetId: 'start-date',
          endTargetId: 'end-date'
        });
      });

      endDateInput.addEventListener('click', () => {
        if (startDateInput.value) {
          datepicker.setAttribute('criteria-date', startDateInput.value);
        }
        openDatePicker({
          target: endDateInput,
          datepicker,
          startTargetId: 'start-date',
          endTargetId: 'end-date'
        });
      });
    }

    // 키보드 인터랙션 데모
    const keyboardInput = document.getElementById('keyboard-input') as HTMLInputElement;
    if (keyboardInput) {
      keyboardInput.value = `${today}T09:00`;
      keyboardInput.addEventListener('click', () => {
        openDatePicker({ target: keyboardInput, datepicker });
      });
    }

    // 검증 데모
    const validationInput = document.getElementById('validation-input') as HTMLInputElement;
    if (validationInput) {
      validationInput.value = `${today}T12:00`;
      validationInput.addEventListener('click', () => {
        // 어제부터 내일까지만 선택 가능
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        datepicker.setAttribute('min-date', yesterday.toISOString().split('T')[0]);
        datepicker.setAttribute('max-date', tomorrowStr);

        openDatePicker({ target: validationInput, datepicker });
      });
    }

    // 포맷팅 데모
    const formattingInput = document.getElementById('formatting-input') as HTMLInputElement;
    if (formattingInput) {
      formattingInput.value = `${today}T13:30`;
      formattingInput.addEventListener('click', () => {
        openDatePicker({ target: formattingInput, datepicker });
      });
    }

    // 캘린더 데모
    const calendarInput = document.getElementById('calendar-input') as HTMLInputElement;
    if (calendarInput) {
      calendarInput.value = today;
      calendarInput.addEventListener('click', () => {
        openDatePicker({ target: calendarInput, datepicker });
      });
    }

    // 시간 선택 데모
    const timeInput = document.getElementById('time-input') as HTMLInputElement;
    if (timeInput) {
      timeInput.value = `${today}T16:30`;
      timeInput.addEventListener('click', () => {
        openDatePicker({ target: timeInput, datepicker });
      });
    }

    // 모달 위치 데모
    ['modal-1', 'modal-2', 'modal-3'].forEach(id => {
      const input = document.getElementById(id) as HTMLInputElement;
      if (input) {
        input.value = input.type === 'datetime-local' ? `${today}T11:00` : today;
        input.addEventListener('click', () => {
          openDatePicker({ target: input, datepicker });
        });
      }
    });

    // 폼 연동 데모
    const formInputs = document.querySelectorAll('#datetime-form input[type="date"], #datetime-form input[type="datetime-local"]');
    formInputs.forEach((input) => {
      const inputEl = input as HTMLInputElement;
      if (inputEl.type === 'datetime-local') {
        inputEl.value = `${today}T10:00`;
      } else {
        inputEl.value = today;
      }

      inputEl.addEventListener('click', () => {
        openDatePicker({ target: inputEl, datepicker });
      });
    });

    // onChange 이벤트 핸들러
    datepicker.addEventListener('onChange', (e: Event) => {
      const { date, time, id } = (e as CustomEvent<OnChangeEventDetail>).detail;
      const target = document.getElementById(id) as HTMLInputElement | null;
      if (!target) return;

      // 날짜 범위 선택의 특별한 처리
      if (id === 'start-date') {
        target.value = date;
        // 시작일 선택 후 자동으로 종료일로 이동
        datepicker.close().then(() => {
          setTimeout(() => {
            const endInput = document.getElementById('end-date') as HTMLInputElement;
            if (endInput) {
              endInput.click();
            }
          }, 100);
        });
        return;
      }

      // 일반적인 값 설정
      if (target.type === 'datetime-local' || target.type === 'datetime') {
        target.value = `${date}T${time}`;
      } else {
        target.value = date;
      }

      // 폼 입력의 경우 validation 트리거
      if (target.closest('form')) {
        target.dispatchEvent(new Event('input', { bubbles: true }));
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

  return (
    <>
      <DocSection {...docs.basic}>
        <div class="demo-item">
          <h4>기본 날짜/시간 선택</h4>
          <input id="basic-input" type="datetime-local" style={{ width: '200px' }} />
          <p class="demo-note">
            📅 클릭하면 커스텀 캘린더 모달이 열립니다
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.dateOnly}>
        <div class="demo-item">
          <h4>날짜만 선택</h4>
          <input id="date-only-input" type="date" style={{ width: '200px' }} />
          <p class="demo-note">
            🗓️ 시간 선택 UI가 숨겨진 상태로 표시됩니다
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.constraints}>
        <div class="demo-item">
          <h4>날짜 범위 제약 (오늘 ~ 30일 후)</h4>
          <input id="constrained-input" type="datetime-local" style={{ width: '200px' }} />
          <p class="demo-note">
            🚫 범위를 벗어나는 날짜는 선택할 수 없습니다
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.criteriaDate}>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>시작일</h4>
            <input id="start-date" type="date" style={{ width: '150px' }} />
          </div>
          <div class="demo-item">
            <h4>종료일</h4>
            <input id="end-date" type="date" style={{ width: '150px' }} />
            <p class="demo-note">
              🎯 시작일이 기준일로 표시됩니다
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection {...docs.keyboard}>
        <div class="demo-item">
          <h4>키보드 인터랙션 테스트</h4>
          <input id="keyboard-input" type="datetime-local" style={{ width: '200px' }} />
          <p class="demo-note">
            ⌨️ Enter로 선택 완료, ESC로 닫기, Tab으로 필드 이동
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.validation}>
        <div class="demo-item">
          <h4>검증 및 에러 처리 (어제 ~ 내일)</h4>
          <input id="validation-input" type="datetime-local" style={{ width: '200px' }} />
          <p class="demo-note">
            ⚠️ 잘못된 값 입력 시 구체적인 에러 메시지가 표시됩니다
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.formatting}>
        <div class="demo-item">
          <h4>자동 포맷팅 테스트</h4>
          <input id="formatting-input" type="datetime-local" style={{ width: '200px' }} />
          <p class="demo-note">
            🔄 입력 시 실시간으로 YYYY-MM-DD, HH:MM 형태로 포맷팅됩니다
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.calendar}>
        <div class="demo-item">
          <h4>캘린더 네비게이션 및 상태 표시</h4>
          <input id="calendar-input" type="date" style={{ width: '200px' }} />
          <p class="demo-note">
            📆 오늘, 주말, 공휴일이 각각 다른 스타일로 표시됩니다
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.timeSelection}>
        <div class="demo-item">
          <h4>세밀한 시간 선택 (30분 단위)</h4>
          <input id="time-input" type="datetime-local" style={{ width: '200px' }} />
          <p class="demo-note">
            🕐 00:00부터 23:30까지 30분 간격으로 선택 가능합니다
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.modal}>
        <div class="demo-item">
          <h4>다양한 위치의 모달 테스트</h4>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '20px' }}>
            <input id="modal-1" type="date" style={{ margin: '10px', width: '150px' }} />
            <input id="modal-2" type="datetime-local" style={{ margin: '50px', width: '180px' }} />
            <input id="modal-3" type="date" style={{ margin: '100px 20px', width: '150px' }} />
          </div>
          <p class="demo-note">
            📍 각 input 위치에 따라 모달이 적절한 위치에 표시됩니다
          </p>
        </div>
      </DocSection>

      <DocSection {...docs.formIntegration}>
        <form
          id="datetime-form"
          preventdefault:submit
          onSubmit$={handleFormSubmit}
          class="demo-form"
        >
          <div class="form-field">
            <label>
              이벤트 시작 (필수):
              <input id="event-start" name="startDate" type="datetime-local" required style={{ width: '200px' }} />
            </label>
          </div>

          <div class="form-field">
            <label>
              이벤트 종료 (필수):
              <input id="event-end" name="endDate" type="datetime-local" required style={{ width: '200px' }} />
            </label>
          </div>

          <div class="form-field">
            <label>
              리마인더 날짜:
              <input id="reminder" name="reminderDate" type="date" style={{ width: '180px' }} />
            </label>
          </div>

          <button type="submit" class="gradient-btn submit">이벤트 생성</button>
          <button type="reset" class="gradient-btn clear">초기화</button>

          <div class="form-output-container">
            <h4>폼 데이터 출력:</h4>
            <pre class="form-output"></pre>
          </div>
        </form>
      </DocSection>

      <AgDatepickerHost />
    </>
  );
});