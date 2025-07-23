import { LitElement, html } from 'lit';
import { InteractiveVirtualSelect } from '@/components/class/select';

interface VirtualSelectOption {
  value: string;
  label: string;
}

export class AgSelect extends LitElement {
  static formAssociated = true;

  static get properties() {
    return {
      id: { type: String },
      name: { type: String },
      required: { type: Boolean, reflect: true },
      width: { type: String },
      height: { type: String },
      optionItems: { type: Array },
      open: { type: Boolean, state: true },
      _labelText: { type: String, state: true },
      showReset: { type: Boolean }, // 새로 추가: reset 버튼 표시 여부
    };
  }

  declare id: string;
  declare name: string;
  declare required: boolean;
  declare width: string | null;
  declare height: string;
  declare optionItems: VirtualSelectOption[];
  declare showReset: boolean; // 새로 추가

  declare open: boolean;
  declare _labelText: string;

  declare _value: string | null;
  declare _initialValue: string | null;
  declare _initialLabel: string | null; // 새로 추가: 초기 라벨 저장
  declare _virtual: InteractiveVirtualSelect | null;
  declare _options: HTMLOptionElement[];
  declare _internals: ElementInternals;

  private _handleKeydownBound: (e: KeyboardEvent) => void;

  constructor() {
    super();
    this._internals = this.attachInternals();
    this._value = null;
    this._initialValue = null;
    this._initialLabel = null; // 새로 추가
    this._virtual = null;
    this._options = [];
    this.width = null;
    this.height = '100%';
    this.required = false;
    this.optionItems = [];
    this.open = false;
    this._labelText = '';
    this.showReset = true; // 기본값: reset 버튼 표시
    this._handleKeydownBound = (e) => this._virtual?.handleKeydown(e);
    this.tabIndex = 0;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();

    // 초기화를 먼저 수행
    this.initializeOptionsFromPropsOrSlot();

    window.addEventListener('ag-select-open', this.onOtherSelectOpened);
    window.addEventListener('click', this.handleOutsideClick, true);
    this.addEventListener('keydown', this._handleKeydownBound);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('ag-select-open', this.onOtherSelectOpened);
    window.removeEventListener('click', this.handleOutsideClick);
    this.removeEventListener('keydown', this._handleKeydownBound);
    this._virtual?.destroy();
    this._virtual = null;
    this.value = '';
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('optionItems')) {
      this.initializeOptionsFromPropsOrSlot();
      // initializeOptionsFromPropsOrSlot()에서 이미 기본값 설정이 완료됨
    }
  }

  render() {
    // 현재 값이 첫 번째 옵션(기본값)과 다를 때만 reset 버튼 표시
    // _options가 아직 초기화되지 않았을 경우를 대비해 안전하게 처리
    const firstOptionValue = this._options && this._options.length > 0 ? this._options[0].value : null;
    const showResetButton = this.showReset &&
                           this._value !== null &&
                           firstOptionValue !== null &&
                           this._value !== firstOptionValue;

    return html`
      <div class="ag-select" style="width: ${this.width}; height: ${this.height};">
        <button type="button" class="selected ${showResetButton ? 'with-reset' : ''}" @click=${this.toggleDropdown}>
          ${this._labelText}
          ${showResetButton
            ? html`<button
                type="button"
                class="reset-button"
                @click=${this.resetToDefault}
                title="기본값으로 되돌리기"
              >×</button>`
            : ''
          }
          <span class="arrow">▼</span>
        </button>
        <div class="ag-select-listbox ag-select-scroll ${this.open ? '' : 'hidden'}" role="listbox"></div>
      </div>
    `;
  }

  // 새로 추가: 기본값으로 되돌리기 함수
  private resetToDefault = (e: Event): void => {
    e.stopPropagation(); // 드롭다운이 열리지 않도록 방지

    // 기본값은 첫 번째 옵션
    if (this._options.length > 0) {
      const firstOption = this._options[0];
      this.value = firstOption.value;
      this._labelText = firstOption.textContent || '';

      this.dispatchEvent(
        new CustomEvent('onReset', {
          detail: { value: firstOption.value, label: firstOption.textContent || '' },
          bubbles: true,
          composed: true,
        })
      );
    }
  };

  public toggleDropdown = (): void => {
    if (this.open) this.closeDropdown();
    else this.openDropdown();
  };

  private initializeOptionsFromPropsOrSlot(): void {
    this._value = null;

    // 1. slot 기반 <option> 우선
    const optionEls = Array.from(this.querySelectorAll('option')) as HTMLOptionElement[];

    if (optionEls.length > 0) {
      // slot 기반 <option> 사용
      this._options = optionEls.map(opt => opt.cloneNode(true) as HTMLOptionElement);
      optionEls.forEach(opt => opt.remove());
    }
    // 2. fallback: 배열 기반 optionItems 사용
    else if (Array.isArray(this.optionItems) && this.optionItems.length > 0) {
      this._options = this.optionItems.map(opt => {
        const el = document.createElement('option');
        el.value = opt.value;
        el.textContent = opt.label;
        return el;
      });
    } else {
      this._options = [];
    }

    // 3. 동적 width 계산 (width 미지정 시)
    if (!this.width) {
      const texts = this._options.map(opt => opt.textContent ?? '');
      const measured = this.getMaxOptionWidth(texts, getComputedStyle(this).font || '14px sans-serif');
      const padded = Math.ceil(measured) + 32;
      const minWidth = 100;

      const selectBox = this.querySelector('.ag-select') as HTMLDivElement;
      if (selectBox) {
        selectBox.style.width = `${Math.max(padded, minWidth)}px`;
      }
    }

    // 4. 초기 선택값 처리
    const selected = this._options.find(opt => opt.selected);
    if (selected) {
      this.value = selected.value;
    } else {
      // selected가 없으면 첫 번째 옵션을 기본값으로 설정
      const fallback = this._options[0];
      if (fallback) {
        this.value = fallback.value;
      }
    }

    // 5. 기본값은 항상 첫 번째 옵션으로 설정 (초기값 저장용)
    if (this._options.length > 0) {
      this._initialValue = this._options[0].value;
      this._initialLabel = this._options[0].textContent || '';
    }
  }

  private openDropdown(): void {
    window.dispatchEvent(new CustomEvent('ag-select-open', { detail: this }));

    const scrollEl = this.querySelector('.ag-select-scroll') as HTMLDivElement;
    if (!this._virtual && scrollEl) {
      this._virtual = this._createVirtualSelect(this.getAllOptionData(), scrollEl);
    }

    this.open = true;
    const selectedIndex = this.getAllOptionData().findIndex((opt) => opt.value === this._value);
    requestAnimationFrame(() => {
      this._virtual?.setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    });
  }

  public closeDropdown(): void {
    this.open = false;
  }

  private selectOption(value: string, label: string): void {
    this._labelText = label;
    this._setValue(value);
    this.closeDropdown();

    this.dispatchEvent(
      new CustomEvent('onSelect', {
        detail: { value, label },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleOutsideClick = async (e: MouseEvent) => {
    const target = e.target as Node;
    const box = this.querySelector('.ag-select') as HTMLDivElement;
    if (box?.contains(target)) return;
    if (!this.contains(target)) await this.closeDropdown();
  };

  private onOtherSelectOpened = (e: Event): void => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail !== this && this.open) {
      this.closeDropdown();
    }
  };

  private getMaxOptionWidth(texts: string[], font: string): number {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.font = font;
    return Math.max(...texts.map((t) => (ctx.measureText(t).width > 100 ? ctx.measureText(t).width : 100)));
  }

  public getAllOptionData(): VirtualSelectOption[] {
    return this._options.map((opt) => ({
      value: opt.value,
      label: opt.textContent ?? '',
    }));
  }

  public _createVirtualSelect(options: VirtualSelectOption[], container: HTMLDivElement) {
    return new InteractiveVirtualSelect(container, options, {
      renderOption: (el: HTMLElement, opt: VirtualSelectOption) => (el.textContent = opt.label),
      onClick: (opt: VirtualSelectOption) => setTimeout(() => this.selectOption(opt.value, opt.label), 0),
      onEscape: () => this.closeDropdown(),
    });
  }

  private _setValue(newVal: string, emit: boolean = true): void {
    if (this._value === newVal) return;

    this._value = newVal;
    const matched = this._options.find((opt) => opt.value === newVal);
    this._labelText = matched?.textContent ?? this._labelText ?? '';

    this._internals.setFormValue(this._value || '');

    if (this.required && !this._value) {
      this._internals.setValidity({ valueMissing: true }, '필수 항목입니다.');
    } else {
      this._internals.setValidity({});
    }

    this.requestUpdate();
    if (emit) this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }));
  }

  get options(): HTMLOptionElement[] {
    return this._options;
  }

  get selectedIndex(): number {
    return this._options.findIndex((opt) => opt.value === this._value);
  }

  get value(): string | null {
    return this._value;
  }

  set value(newVal: string) {
    this._setValue(newVal, true);
  }

  get defaultValue(): string | null {
    // 기본값은 항상 첫 번째 옵션
    return this._options.length > 0 ? this._options[0].value : null;
  }

  // 새로 추가: 프로그래밍적으로 기본값으로 되돌리기
  public resetToDefaultValue(): void {
    this.resetToDefault(new Event('reset'));
  }
}

if (!customElements.get('ag-select')) {
  customElements.define('ag-select', AgSelect);
}