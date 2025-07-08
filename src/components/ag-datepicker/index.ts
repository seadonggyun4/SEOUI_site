import { LitElement, html } from 'lit'

export class AgDatePicker extends LitElement {
  static formAssociated = true;

  static get observedAttributes() {
    return ['disabled', 'hidden', 'criteria-date', 'min-date', 'max-date', 'date', 'time'];
  }

  declare disabled: boolean;
  declare hidden: boolean;
  declare criteriaDate: string | null;
  declare minDate: string | null;
  declare maxDate: string | null;
  private _date = '';
  private _time = '';

  private currentYear = new Date().getFullYear();
  private currentMonth = new Date().getMonth();
  private isValid = true;
  private openX = 0;
  private openY = 0;
  private errorMessage = '';
  private triggerEl: HTMLElement | null = null;
  private showTime = true;

  private internals: ElementInternals;

  constructor () {
    super();
    this.internals = this.attachInternals();
    this.hidden = true;
    this.disabled = false;
    this.criteriaDate = null;
    this.minDate = null;
    this.maxDate = null;
  }

  createRenderRoot () {
    return this;
  }

  connectedCallback () {
    super.connectedCallback();
    this.addEventListener('keydown', this.handleKeydown, true);
    this.addEventListener('keydown', this._stopEventPropagation, { capture: true });
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.handleKeydown, true);
    this.removeEventListener('keydown', this._stopEventPropagation, true);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'disabled':
        this.disabled = newValue !== null;
        break;
      case 'hidden':
        break;
      case 'criteria-date':
        this.criteriaDate = newValue;
        break;
      case 'min-date':
        this.minDate = newValue;
        break;
      case 'max-date':
        this.maxDate = newValue;
        break;
      case 'date':
        this.date = newValue ?? '';
        break;
      case 'time':
        this.time = newValue ?? '';
        break;
    }
  }

  private _stopEventPropagation = (e: Event) => {
    e.stopImmediatePropagation()
  }

  private handleKeydown = async (e: KeyboardEvent) => {
    if (e.key === 'Escape') await this.close()
    if(e.key === 'Enter') this.change()
  }

  private handleOutsideClick = async (e: MouseEvent) => {
    const path = e.composedPath()

    // 트리거 엘리먼트를 클릭한 경우 → 닫지 않음
    if (this.triggerEl && path.includes(this.triggerEl)) return

    if (!path.includes(this)) await this.close()
  }

  public open (rect: DOMRect, triggerEl?: HTMLElement, timeShow: boolean = true) {
    this.minDate = this.minDate && null
    this.maxDate = this.maxDate && null
    const el = this.datepickerEl
    el.style.transition = 'none'
    const isSameTrigger = this.triggerEl === triggerEl
    const isFirstOpen = !this.triggerEl

    this.showTime = timeShow
    this.triggerEl = triggerEl ?? null
    this.removeAttribute('hidden')

    // 위치 설정
    this.openX = rect.left + rect.width / 2
    this.openY = rect.top + rect.height / 2
    el.style.left = `${this.openX}px`
    el.style.top = `${this.openY}px`

    if (!isSameTrigger || isFirstOpen) {
      el.classList.remove('enter') // 초기화
      void el.offsetWidth// 강제 reflow
      el.style.transition = 'all 0.3s ease-in-out'
    }

    el.classList.add('enter')
    if (!this._date || !this._time) this.setDateTime()

    setTimeout(() => {
      this.inputSelectAll(this.$dateInput)
      if (this.showTime) this.scrollToSelectedTime()
      window.addEventListener('click', this.handleOutsideClick)
    }, 0)
  }

  public close (): Promise<void> {
    return new Promise((resolve) => {
      const el = this.datepickerEl
      this.triggerEl = null
      el.style.transition = 'all 0.3s ease-in-out'
      el.classList.remove('enter')

      this.minDate = null
      this.maxDate = null
      this.criteriaDate = null

      const onTransitionEnd = (e: TransitionEvent) => {
        if (e.target !== el || e.propertyName !== 'transform') return
        el.removeEventListener('transitionend', onTransitionEnd)
        this.setAttribute('hidden', '')
        window.removeEventListener('click', this.handleOutsideClick)
        resolve()
      }

      el.addEventListener('transitionend', onTransitionEnd)
    })
  }

  private validateDateTime () {
    const dateValid = /^\d{4}-\d{2}-\d{2}$/.test(this._date)
    const timeValid = /^\d{2}:\d{2}$/.test(this._time)
    const isTimeRequired = this.showTime

    let valid = dateValid
    let error = ''

    if (dateValid) {
      const [ y, m, d ] = this._date.split('-').map(Number)
      const lastDay = new Date(y, m, 0).getDate()

      if (m < 1 || m > 12) {
        valid = false
        error = '※ 월은 1~12 사이여야 합니다.'
      } else if (d < 1 || d > lastDay) {
        valid = false
        error = `※ ${m}월은 ${lastDay}일까지 존재합니다.`
      } else {
        const [ h = 0, mi = 0 ] = this._time.split(':').map(Number)
        const current = new Date(y, m - 1, d, h, mi)
        const min = this._minDateObj
        const max = this._maxDateObj

        if (min && current < min) {
          valid = false
          error = `※ ${this.minDate} 이후만 선택 가능합니다.`
        } else if (max && current > max) {
          valid = false
          error = `※ ${this.maxDate} 이전만 선택 가능합니다.`
        }
      }
    }

    if (isTimeRequired && timeValid) {
      const [ h, m ] = this._time.split(':').map(Number)

      if (h > 23 || (h === 23 && m > 30)) {
        valid = false
        error = '※ 23:30까지만 입력 가능합니다.'
      }
    } else if (isTimeRequired && !timeValid) {
      valid = false
      error = '※ 시간 형식이 올바르지 않습니다.'
    }

    this.isValid = valid
    this.errorMessage = valid ? '' : error
  }

  private formatDateInput (value: string): string {
    return value
      .replace(/[^0-9]/g, '')
      .slice(0, 8)
      .replace(/(\d{4})(\d{0,2})?(\d{0,2})?/, (_, y, m = '', d = '') => `${y}${m ? '-' + m : ''}${d ? '-' + d : ''}`)
  }

  private formatTimeInput (value: string): string {
    const cleaned = value.replace(/[^0-9]/g, '').slice(0, 4)

    if (cleaned.length < 4) {
      return cleaned.replace(/(\d{2})(\d{0,2})?/, (_, h, m = '') => `${h}${m ? ':' + m : ''}`)
    }

    let h = Number(cleaned.slice(0, 2))
    let m = Number(cleaned.slice(2, 4))

    if (m >= 45) {
      h += 1
      m = 0
    } else if (m >= 15) {
      m = 30
    } else {
      m = 0
    }

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  private setDateTime () {
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    let hh = now.getHours()
    const rawMin = now.getMinutes()
    let minRounded: string

    if (rawMin < 15) minRounded = '00'
    else if (rawMin < 45) minRounded = '30'
    else { hh = (hh + 1) % 24; minRounded = '00' }

    const hourStr = String(hh).padStart(2, '0')

    if (!this._date) this.date = `${yyyy}-${mm}-${dd}`
    if (this.showTime && !this._time) this.time = `${hourStr}:${minRounded}`
    this.currentYear = now.getFullYear()
    this.currentMonth = now.getMonth()
    this.validateDateTime()
  }

  private getCalendarDays (): number[] {
    const year = this.currentYear
    const month = this.currentMonth

    const firstDay = new Date(year, month, 1).getDay() // 0 = 일요일
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const prefix = Array.from({ length: firstDay }, () => 0) // 앞에 빈칸
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    const total = prefix.length + days.length
    const postfixCount = 42 - total // 6줄 고정 (7 x 6 = 42)
    const postfix = Array.from({ length: postfixCount }, () => 0)

    return [ ...prefix, ...days, ...postfix ]
  }

  private onDateClick = (day: number) => {
    if (this.disabled || !day) return
    if (this.isDateDisabled(this.currentYear, this.currentMonth, day)) return

    const yyyy = this.currentYear
    const mm = String(this.currentMonth + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    this.date = `${yyyy}-${mm}-${dd}`
    this.inputSelectAll(this.$dateInput)
  }

  private onTimeClick = (time: number) => {
    if (this.disabled || !time) return
    this.time = time.toString()
    this.inputSelectAll(this.$timeInput)
  }

  private scrollToSelectedTime () {
    const container = this.datepickerEl.querySelector('.time-picker ul') as HTMLElement
    if (!container) return

    const selected = container.querySelector('li.selected') as HTMLElement

    if (selected) {
      const top = selected.offsetTop - (container.offsetHeight / 2 + selected.offsetHeight / 2)
      container.scrollTop = top
    }
  }

  public async change () {
    if (!this.isValid) return this.inputSelectAll(this.$dateInput)
    this.dispatchEvent(new CustomEvent('onChange', {
      detail: {
        date: this._date,
        time: this._time,
        id  : this.triggerEl?.id ?? null,
        name: (this.triggerEl as HTMLInputElement | null)?.name ?? null
      },
      bubbles : true,
      composed: true
    }))

    await this.close()
  }

  private moveToPrevMonth = () => {
    if (this.currentMonth === 0) {
      this.currentMonth = 11
      this.currentYear -= 1
    } else {
      this.currentMonth -= 1
    }
    this.requestUpdate();
  }

  private moveToNextMonth = () => {
    if (this.currentMonth === 11) {
      this.currentMonth = 0
      this.currentYear += 1
    } else {
      this.currentMonth += 1
    }
    this.requestUpdate();
  }

  private getKoreanHolidays (year: number): Set<string> {
    return new Set([
      `${year}-01-01`, // 신정
      `${year}-03-01`, // 삼일절
      `${year}-05-05`, // 어린이날
      `${year}-06-06`, // 현충일
      `${year}-08-15`, // 광복절
      `${year}-10-03`, // 개천절
      `${year}-10-09`, // 한글날
      `${year}-12-25` // 성탄절
    ])
  }

  private getCalendarDayClass (day: number, index: number): string {
    const yyyy = this.currentYear
    const mm = String(this.currentMonth + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    const dateStr = `${yyyy}-${mm}-${dd}`

    const [ y, m, d ] = this._date.split('-').map(Number)
    const isSelected = y === yyyy && m === this.currentMonth + 1 && d === day

    const today = new Date()
    const isToday = today.getFullYear() === yyyy &&
                    today.getMonth() === this.currentMonth &&
                    today.getDate() === day

    const weekday = index % 7
    const isWeekend = weekday === 0 || weekday === 6
    const isHoliday = this.getKoreanHolidays(yyyy).has(dateStr)

    const classList = ['day']
    if (isSelected) classList.push('selected')
    if (isToday) classList.push('today')
    if (isHoliday) classList.push('holiday')
    if (isWeekend) classList.push('weekend')
    if (this.criteriaDate) {
      const [criteriaYMD] = this.criteriaDate.split(/[T\s]/);
      if (criteriaYMD === dateStr) {
        classList.push('criteria')
      }
    }

    const isDisabled = this.isDateDisabled(yyyy, this.currentMonth, day)
    if (isDisabled) classList.push('disabled')

    return classList.join(' ')
  }

  private inputSelectAll = (input: HTMLInputElement | null) => {
    if (!input) return
    setTimeout(() => {
      input.select()
    }, 0)
  }

  private handleFocusSelectAll = (e: FocusEvent) => {
    const input = e.target as HTMLInputElement
    input.select()
  }

  private handleDateInput = (e: Event) => {
    const inputEl = e.target as HTMLInputElement

    const selectionStart = inputEl.selectionStart ?? 0
    const oldValue = inputEl.value

    const formatted = this.formatDateInput(oldValue)

    const cursorOffset = this._getCursorOffset(oldValue, formatted, selectionStart)

    inputEl.value = formatted
    this.date = formatted

    inputEl.setSelectionRange(cursorOffset, cursorOffset)

    if (formatted.length === 10) this.inputSelectAll(this.$timeInput)
  }

  private handleTimeInput = (e: Event) => {
    const inputEl = e.target as HTMLInputElement
    const selectionStart = inputEl.selectionStart ?? 0
    const oldValue = inputEl.value

    const formatted = this.formatTimeInput(oldValue)
    const cursorOffset = this._getCursorOffset(oldValue, formatted, selectionStart)

    inputEl.value = formatted
    this.time = formatted
    inputEl.setSelectionRange(cursorOffset, cursorOffset)

    this.validateDateTime()
    requestAnimationFrame(() => this.scrollToSelectedTime())
  }

  private _getCursorOffset (oldVal: string, newVal: string, oldPos: number): number {
    // 포맷 전과 후의 문자열 길이 차이를 기반으로 위치 보정
    let diff = 0

    for (let i = 0, j = 0; i < oldPos && j < newVal.length; i++, j++) {
      if (oldVal[i] !== newVal[j]) {
        while (oldVal[i] !== newVal[j] && j < newVal.length) {
          j++
          diff++
        }
      }
    }

    return oldPos + diff
  }

  private isDateDisabled (y: number, m: number, d: number): boolean {
    const date = new Date(y, m, d)

    if (this._minDateObj && date < new Date(this._minDateObj.getFullYear(), this._minDateObj.getMonth(), this._minDateObj.getDate())) {
      return true
    }

    if (this._maxDateObj && date > new Date(this._maxDateObj.getFullYear(), this._maxDateObj.getMonth(), this._maxDateObj.getDate())) {
      return true
    }

    return false
  }

  get date () {
    return this._date;
  }
  set date (value: string) {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      this._date = value;
      this.currentYear = parsed.getFullYear();
      this.currentMonth = parsed.getMonth();
      this.requestUpdate();
    } else {
      this._date = value;
    }
    this.validateDateTime();
  }

  get time () {
    return this._time;
  }
  set time (value: string) {
    this._time = value;
    this.validateDateTime();
    this.requestUpdate();
  }

  private get $dateInput (): HTMLInputElement | null {
    return this.querySelector('.date-input');
  }

  private get $timeInput (): HTMLInputElement | null {
    return this.querySelector('.time-input');
  }

  private get datepickerEl (): HTMLDivElement {
    return this.querySelector('.ag-datepicker-wrapper')!;
  }

  private get _minDateObj (): Date | null {
    return this.minDate ? new Date(this.minDate) : null
  }

  private get _maxDateObj (): Date | null {
    return this.maxDate ? new Date(this.maxDate) : null
  }

  render () {
    const calendarDays = this.getCalendarDays()
    const weekdays = [ '일', '월', '화', '수', '목', '금', '토' ]
    const times = Array.from({ length: 48 }).map((_, i) => `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`)

    return html`
      <div class="ag-datepicker-wrapper">
        <header class="datepicker-header">
          <button class="prev" type="button" @click=${this.moveToPrevMonth}>
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <span>${this.currentYear}년 ${this.currentMonth + 1}월</span>
          <button class="next" type="button" @click=${this.moveToNextMonth}>
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </header>
        <article class="calendar-time">
          <div class="calendar">
            <div class="calendar-body">
              <div class="calendar-weekdays">
                ${weekdays.map(d => html`<div class="weekday">${d}</div>`)}
              </div>
              <div class="calendar-grid">
                ${calendarDays.map((day, index) => {
    if (day <= 0) return html`<div class="empty"></div>`

    return html`
                    <div
                      class=${this.getCalendarDayClass(day, index)}
                      @click=${() => this.onDateClick(day)}
                    >
                      ${day}
                    </div>
                  `
  })}
              </div>
            </div>
          </div>

          ${this.showTime ? html`
            <div class="time-picker">
              <div class="time-title">시간 선택</div>
              <ul>
                ${times.map(time => html`
                  <li class=${this._time === time ? 'selected' : ''} @click=${() => this.onTimeClick(Number(time))}>${time}</li>
                `)}
              </ul>
            </div>
          ` : null}
        </article>
        ${this.errorMessage
    ? html`<p class="notice error">${this.errorMessage}</p>`
    : html`<p class="notice">※ 오직 숫자만 입력 가능합니다.</p>`}
        <footer class="datepicker-controler ${this.showTime ? null : 'no-time'}">
          <div class="input-group">
            <i class="fa-solid fa-calendar-days"></i>
            <input
              class="date-input"
              type="text"
              .value=${this._date}
              required
              @input=${this.handleDateInput}
              @focus=${this.handleFocusSelectAll}
            />
          </div>

          ${this.showTime ? html`
            <div class="input-group">
              <i class="fa-solid fa-clock"></i>
              <input
                class="time-input"
                type="text"
                .value=${this._time}
                required
                @input=${this.handleTimeInput}
                @focus=${this.handleFocusSelectAll}
              />
            </div>
          ` : null}

          <button type="button" ?disabled=${!!this.errorMessage || !this.isValid}  @click=${() => this.change()}>선택</button>
        </footer>
      </div>
    `
  }
}

customElements.define('ag-datepicker', AgDatePicker);
