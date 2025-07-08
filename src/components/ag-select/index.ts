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
    };
  }

  declare id: string;
  declare name: string;
  declare required: boolean;
  declare width: string | null;
  declare height: string;
  declare optionItems: VirtualSelectOption[];

  declare open: boolean;
  declare _labelText: string;

  declare _value: string | null;
  declare _initialValue: string | null;
  declare _virtual: InteractiveVirtualSelect | null;
  declare _options: HTMLOptionElement[];
  declare _internals: ElementInternals;

  private _handleKeydownBound: (e: KeyboardEvent) => void;

  constructor() {
    super();
    this._internals = this.attachInternals();
    this._value = null;
    this._initialValue = null;
    this._virtual = null;
    this._options = [];
    this.width = null;
    this.height = '100%';
    this.required = false;
    this.optionItems = [];
    this.open = false;
    this._labelText = '';
    this._handleKeydownBound = (e) => this._virtual?.handleKeydown(e);
    this.tabIndex = 0;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
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
      this._initialValue = this._value;
    }
  }

  render() {
    return html`
      <div class="ag-select" style="width: ${this.width}; height: ${this.height};">
        <button type="button" class="selected" @click=${this.toggleDropdown}>
          ${this._labelText}
          <span class="arrow">▼</span>
        </button>
        <div class="ag-select-listbox ag-select-scroll ${this.open ? '' : 'hidden'}" role="listbox"></div>
      </div>
    `;
  }

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
      return;
    }

    const fallback = this._options[0];
    if (fallback) this.value = fallback.value;
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

  public  _createVirtualSelect(options: VirtualSelectOption[], container: HTMLDivElement) {
    return new InteractiveVirtualSelect(container, options, {
      renderOption: (el: HTMLElement, opt: VirtualSelectOption) => (el.textContent = opt.label),
      onClick: (opt : VirtualSelectOption) => setTimeout(() => this.selectOption(opt.value, opt.label), 0),
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
    return this._initialValue;
  }
}

if (!customElements.get('ag-select')) {
  customElements.define('ag-select', AgSelect);
}
