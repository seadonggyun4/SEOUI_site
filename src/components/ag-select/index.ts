import { LitElement, html } from 'lit';
import { InteractiveVirtualSelect } from '@/components/class/InteractiveVirtualSelect';
import './style.scss'

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
      showReset: { type: Boolean },
      multiple: { type: Boolean },
      _selectedValues: { type: Array, state: true },
      _isLoading: { type: Boolean, state: true },
    };
  }

  declare id: string;
  declare name: string;
  declare required: boolean;
  declare width: string | null;
  declare height: string;
  declare optionItems: VirtualSelectOption[];
  declare showReset: boolean;
  declare multiple: boolean;

  declare open: boolean;
  declare _labelText: string;
  declare _selectedValues: string[];
  declare _isLoading: boolean;

  declare _value: string | null;
  declare _initialValue: string | null;
  declare _initialLabel: string | null;
  declare _virtual: InteractiveVirtualSelect | null;
  declare _options: HTMLOptionElement[];
  declare _internals: ElementInternals;

  private _handleKeydownBound: (e: KeyboardEvent) => void;

  constructor() {
    super();
    this._internals = this.attachInternals();
    this._value = null;
    this._initialValue = null;
    this._initialLabel = null;
    this._virtual = null;
    this._options = [];
    this.width = null;
    this.height = '100%';
    this.required = false;
    this.optionItems = [];
    this.open = false;
    this._labelText = '';
    this.showReset = true;
    this.multiple = false;
    this._selectedValues = [];
    this._isLoading = false;
    this._handleKeydownBound = (e) => this._virtual?.handleKeydown(e);
    this.tabIndex = 0;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
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

    if (this.multiple) {
      this._selectedValues = [];
    } else {
      this.value = '';
    }
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('optionItems')) {
      this.initializeOptionsFromPropsOrSlot();
    }
  }

  protected getCloseIcon() {
    return html`
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  protected getChevronDownIcon() {
    return html`
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  protected getChevronUpIcon() {
    return html`
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 10L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  protected renderLoadingSpinner() {
    return html`
      <div class="loading-container">
        <div class="loading-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <span class="loading-text">옵션 로딩 중...</span>
      </div>
    `;
  }

  protected renderNoData() {
    return html`
      <div class="no-data-container">
        <span class="no-data-text">데이터 없음</span>
      </div>
    `;
  }

  protected renderDropdown() {
    const hasOptions = this.getAllOptionData().length > 0;
    const showNoData = this.multiple && !this._isLoading && !hasOptions;

    return html`
      <div class="ag-select-listbox ag-select-scroll ${this.open ? '' : 'hidden'}" role="listbox">
        ${this._isLoading
          ? this.renderLoadingSpinner()
          : showNoData
            ? this.renderNoData()
            : ''
        }
      </div>
    `;
  }

  render() {
    if (this.multiple) {
      return this.renderMultiSelect();
    } else {
      return this.renderSingleSelect();
    }
  }

  protected renderMultiSelect() {
    const showResetButton = this.showReset && this._selectedValues.length > 0;

    return html`
      <div class="ag-select multi-select ${this.open ? 'open' : ''}" style="width: ${this.width}; height: ${this.height};">
        <div class="selected-container ${showResetButton ? 'with-reset' : ''}" @click=${this.toggleDropdown}>
          <div class="selected-tags">
            ${this._selectedValues.map(value => {
              const option = this._options.find(opt => opt.value === value);
              const label = option?.textContent || value;
              return html`
                <span class="tag">
                  ${label}
                  <button
                    type="button"
                    class="tag-remove"
                    @click=${(e: Event) => this.removeTag(e, value)}
                    title="제거"
                  >${this.getCloseIcon()}</button>
                </span>
              `;
            })}
            ${this._selectedValues.length === 0
              ? html`<span class="placeholder">선택해주세요</span>`
              : ''
            }
          </div>
          ${showResetButton
            ? html`<button
                type="button"
                class="multi-reset-button"
                @click=${this.resetToDefault}
                title="모두 지우기"
              >${this.getCloseIcon()}</button>`
            : ''
          }
          <span class="arrow">${this.open ? this.getChevronUpIcon() : this.getChevronDownIcon()}</span>
        </div>
        ${this.renderDropdown()}
      </div>
    `;
  }

  protected renderSingleSelect() {
    const firstOptionValue = this._options && this._options.length > 0 ? this._options[0].value : null;
    const showResetButton = this.showReset &&
                          this._value !== null &&
                          firstOptionValue !== null &&
                          this._value !== firstOptionValue;

    return html`
      <div class="ag-select ${this.open ? 'open' : ''}" style="width: ${this.width}; height: ${this.height};">
        <button type="button" class="selected ${showResetButton ? 'with-reset' : ''}" @click=${this.toggleDropdown}>
          ${this._labelText}
          ${showResetButton
            ? html`<button
                type="button"
                class="reset-button"
                @click=${this.resetToDefault}
                title="기본값으로 되돌리기"
              >${this.getCloseIcon()}</button>`
            : ''
          }
          <span class="arrow">${this.open ? this.getChevronUpIcon() : this.getChevronDownIcon()}</span>
        </button>
        ${this.renderDropdown()}
      </div>
    `;
  }

  protected removeTag = (e: Event, valueToRemove: string): void => {
    e.stopPropagation();
    this._selectedValues = this._selectedValues.filter(value => value !== valueToRemove);
    this.updateFormValue();

    const option = this._options.find(opt => opt.value === valueToRemove);

    if (this.open) {
      this._virtual?.destroy();
      this._virtual = null;

      // 선택 해제 후 옵션이 있으면 가상 스크롤 재생성
      const optionData = this.getAllOptionData();
      if (optionData.length > 0) {
        const scrollEl = this.querySelector('.ag-select-scroll') as HTMLDivElement;
        if (scrollEl) {
          this._virtual = this._createVirtualSelect(optionData, scrollEl);
          requestAnimationFrame(() => {
            // 다중 선택 모드에서는 항상 첫 번째 옵션으로 포커스 초기화
            this._virtual?.setActiveIndex(0);
          });
        }
      }
    }

    this.dispatchEvent(
      new CustomEvent('onDeselect', {
        detail: { value: valueToRemove, label: option?.textContent || '' },
        bubbles: true,
        composed: true,
      })
    );

    this.requestUpdate();
  };

  protected resetToDefault = (e: Event): void => {
    e.stopPropagation();

    if (this.multiple) {
      this._selectedValues = [];
      this.updateFormValue();

      if (this.open) {
        this._virtual?.destroy();
        this._virtual = null;

        // 리셋 후 모든 옵션이 다시 사용 가능하므로 가상 스크롤 재생성
        const scrollEl = this.querySelector('.ag-select-scroll') as HTMLDivElement;
        if (scrollEl) {
          const optionData = this.getAllOptionData();
          this._virtual = this._createVirtualSelect(optionData, scrollEl);
          requestAnimationFrame(() => {
            // 다중 선택 모드에서는 항상 첫 번째 옵션으로 포커스 초기화
            this._virtual?.setActiveIndex(0);
          });
        }
      }

      this.dispatchEvent(
        new CustomEvent('onReset', {
          detail: { values: [], labels: [] },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      if (this._options.length > 0) {
        const firstOption = this._options[0];
        this.value = firstOption.value;
        this._labelText = firstOption.textContent || '';

        // 드롭다운이 열려있는 경우에만 즉시 activeIndex 업데이트
        if (this.open && this._virtual) {
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          });
        }
        // 드롭다운이 닫혀있어도 다음 열기 시 첫 번째 옵션이 활성화되도록
        // value 설정으로 충분 (initializeVirtualSelect에서 처리됨)

        this.dispatchEvent(
          new CustomEvent('onReset', {
            detail: { value: firstOption.value, label: firstOption.textContent || '' },
            bubbles: true,
            composed: true,
          })
        );
      }
    }
  };

  public toggleDropdown = (): void => {
    if (this.open) this.closeDropdown();
    else this.openDropdown();
  };

  // 옵션이 없는지 확인 - 로딩 상태 판단
  private hasNoOptions(): boolean {
    return this._options.length === 0;
  }

  // 옵션 초기화 - 옵션이 생성되면 즉시 로딩 상태 해제
  private initializeOptionsFromPropsOrSlot(): void {
    const optionEls = Array.from(this.querySelectorAll('option')) as HTMLOptionElement[];

    if (optionEls.length > 0) {
      this._options = optionEls.map(opt => {
        opt.hidden = true;
        return opt;
      });
    } else if (Array.isArray(this.optionItems) && this.optionItems.length > 0) {
      this._options = this.optionItems.map(opt => {
        const el = document.createElement('option');
        el.value = opt.value;
        el.textContent = opt.label;
        el.hidden = true;
        this.appendChild(el);
        return el;
      });
    } else {
      this._options = [];
    }

    // 옵션이 생성되면 즉시 로딩 상태 해제
    if (this._options.length > 0) {
      this._isLoading = false;
    }

    if (this.multiple) {
      const selectedOptions = this._options.filter(opt => opt.selected);
      this._selectedValues = selectedOptions.map(opt => opt.value);
    } else {
      const selected = this._options.find(opt => opt.selected);
      if (selected) {
        this._setValue(selected.value, false);
      } else if (this._options.length > 0) {
        this._setValue(this._options[0].value, false);
      }
    }

    if (this._options.length > 0) {
      this._initialValue = this._options[0].value;
      this._initialLabel = this._options[0].textContent || '';
    }

    this.requestUpdate();
  }

  private openDropdown(): void {
    window.dispatchEvent(new CustomEvent('ag-select-open', { detail: this }));
    this.open = true;
    this.requestUpdate(); // open 상태 변경을 위한 리렌더링

    // 옵션이 없으면 무조건 로딩 시작
    if (this.hasNoOptions()) {
      this._isLoading = true;
      this.requestUpdate();

      // 동적 로딩 시뮬레이션 (실제로는 API 호출 등)
      this.loadOptionsAsync().then(() => {
        // 옵션이 로드되면 initializeOptionsFromPropsOrSlot에서 자동으로 로딩 해제
        this.initializeVirtualSelect();
      }).catch(() => {
        this._isLoading = false;
        this.requestUpdate();
      });
    } else {
      // 옵션이 이미 있다면 바로 가상 스크롤 초기화
      this.initializeVirtualSelect();
    }
  }

  public closeDropdown(): void {
    this.open = false;
    this.requestUpdate(); // open 상태 변경을 위한 리렌더링
  }

  // 가상 스크롤 초기화
  protected initializeVirtualSelect(): void {
    const scrollEl = this.querySelector('.ag-select-scroll') as HTMLDivElement;
    const optionData = this.getAllOptionData();

    // 다중선택에서 모든 항목이 선택된 경우 가상 스크롤 생성하지 않음
    if (this.multiple && optionData.length === 0) {
      return;
    }

    if (!this._virtual && scrollEl && !this._isLoading && optionData.length > 0) {
      this._virtual = this._createVirtualSelect(optionData, scrollEl);

      if (this.multiple) {
        // 다중 선택 모드에서는 항상 첫 번째 옵션으로 초기화
        requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(0);
        });
      } else {
        // 단일 선택 모드에서는 현재 선택된 값의 인덱스 찾기
        const selectedIndex = optionData.findIndex((opt) => opt.value === this._value);
        requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        });
      }
    }
  }

  // 옵션 비동기 로딩 시뮬레이션
  private async loadOptionsAsync(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 실제로는 여기서 API 호출하여 옵션을 설정
        // 예: this.optionItems = fetchedOptions;
        resolve();
      }, Math.random() * 1000 + 500);
    });
  }

  private selectOption(value: string, label: string): void {
    if (this.multiple) {
      this._selectedValues = [...this._selectedValues, value];
      this.updateFormValue();
      this.requestUpdate();

      this._virtual?.destroy();
      this._virtual = null;

      const scrollEl = this.querySelector('.ag-select-scroll') as HTMLDivElement;
      if (scrollEl) {
        const optionData = this.getAllOptionData();
        if (optionData.length > 0) {
          this._virtual = this._createVirtualSelect(optionData, scrollEl);
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          });
        }
      }

      this.dispatchEvent(
        new CustomEvent('onSelect', {
          detail: { value, label },
          bubbles: true,
          composed: true,
        })
      );

    } else {
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
  }

  protected updateFormValue(): void {
    if (this.multiple) {
      const formValue = this._selectedValues.join(',');
      this._internals.setFormValue(formValue);

      if (this.required && this._selectedValues.length === 0) {
        this._internals.setValidity({ valueMissing: true }, '필수 항목입니다.');
      } else {
        this._internals.setValidity({});
      }
    }
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
    if (this.multiple) {
      return this._options
        .filter((opt) => !this._selectedValues.includes(opt.value))
        .map((opt) => ({
          value: opt.value,
          label: opt.textContent ?? '',
        }));
    } else {
      return this._options.map((opt) => ({
        value: opt.value,
        label: opt.textContent ?? '',
      }));
    }
  }

  public _createVirtualSelect(options: VirtualSelectOption[], container: HTMLDivElement) {
    return new InteractiveVirtualSelect(container, options, {
      isMultiple: this.multiple,
      renderOption: (el: HTMLElement, opt: VirtualSelectOption) => {
        el.textContent = opt.label;

        if (this.multiple) {
          const isSelected = this._selectedValues.includes(opt.value);
          el.classList.toggle('selected', isSelected);
          if (isSelected) {
            el.innerHTML = `<span class="check-mark">✓</span> ${opt.label}`;
          }
        }
      },
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
    if (this.multiple) {
      return -1;
    }
    return this._options.findIndex((opt) => opt.value === this._value);
  }

  get value(): string | null {
    if (this.multiple) {
      return this._selectedValues.join(',');
    }
    return this._value;
  }

  set value(newVal: string) {
    if (this.multiple) {
      this._selectedValues = newVal ? newVal.split(',').filter(v => v.trim()) : [];
      this.updateFormValue();
      this.requestUpdate();
    } else {
      this._setValue(newVal, true);
    }
  }

  get defaultValue(): string | null {
    return this._options.length > 0 ? this._options[0].value : null;
  }

  get selectedValues(): string[] {
    return this.multiple ? [...this._selectedValues] : [];
  }

  set selectedValues(values: string[]) {
    if (this.multiple) {
      this._selectedValues = [...values];
      this.updateFormValue();
      this.requestUpdate();
    }
  }

  public resetToDefaultValue(): void {
    this.resetToDefault(new Event('reset'));
  }
}

if (!customElements.get('ag-select')) {
  customElements.define('ag-select', AgSelect);
}