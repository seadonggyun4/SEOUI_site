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
      showReset: { type: Boolean },
      multiple: { type: Boolean }, // 새로 추가: 멀티셀렉트 옵션
      _selectedValues: { type: Array, state: true }, // 새로 추가: 선택된 값들의 배열
    };
  }

  declare id: string;
  declare name: string;
  declare required: boolean;
  declare width: string | null;
  declare height: string;
  declare optionItems: VirtualSelectOption[];
  declare showReset: boolean;
  declare multiple: boolean; // 새로 추가

  declare open: boolean;
  declare _labelText: string;
  declare _selectedValues: string[]; // 새로 추가

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
    this.multiple = false; // 기본값: 단일 선택
    this._selectedValues = []; // 새로 추가: 빈 배열로 초기화
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

  // SVG 아이콘들을 반환하는 헬퍼 메서드들
  private getCloseIcon() {
    return html`
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  private getChevronDownIcon() {
    return html`
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  private getChevronUpIcon() {
    return html`
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 10L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  render() {
    if (this.multiple) {
      return this.renderMultiSelect();
    } else {
      return this.renderSingleSelect();
    }
  }

  private renderMultiSelect() {
    const showResetButton = this.showReset && this._selectedValues.length > 0;

    return html`
      <div class="ag-select multi-select" style="width: ${this.width}; height: ${this.height};">
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
                class="reset-button"
                @click=${this.resetToDefault}
                title="모두 지우기"
              >${this.getCloseIcon()}</button>`
            : ''
          }
          <span class="arrow">${this.open ? this.getChevronUpIcon() : this.getChevronDownIcon()}</span>
        </div>
        <div class="ag-select-listbox ag-select-scroll ${this.open ? '' : 'hidden'}" role="listbox"></div>
      </div>
    `;
  }

  private renderSingleSelect() {
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
              >${this.getCloseIcon()}</button>`
            : ''
          }
          <span class="arrow">${this.open ? this.getChevronUpIcon() : this.getChevronDownIcon()}</span>
        </button>
        <div class="ag-select-listbox ag-select-scroll ${this.open ? '' : 'hidden'}" role="listbox"></div>
      </div>
    `;
  }

  private removeTag = (e: Event, valueToRemove: string): void => {
    e.stopPropagation();
    this._selectedValues = this._selectedValues.filter(value => value !== valueToRemove);
    this.updateFormValue();

    const option = this._options.find(opt => opt.value === valueToRemove);

    // Virtual select가 열려있다면 강제로 다시 생성하여 삭제된 항목을 리스트에 즉시 표시
    if (this.open && this._virtual) {
      this._virtual.destroy();
      this._virtual = null;

      const scrollEl = this.querySelector('.ag-select-scroll') as HTMLDivElement;
      if (scrollEl) {
        this._virtual = this._createVirtualSelect(this.getAllOptionData(), scrollEl);
        // 첫 번째 항목에 포커스 설정
        requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(0);
        });
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

  private resetToDefault = (e: Event): void => {
    e.stopPropagation();

    if (this.multiple) {
      // 멀티셀렉트의 경우 모든 선택을 해제
      this._selectedValues = [];
      this.updateFormValue();

      // Virtual select가 열려있다면 강제로 다시 생성하여 모든 항목을 리스트에 즉시 표시
      if (this.open && this._virtual) {
        this._virtual.destroy();
        this._virtual = null;

        const scrollEl = this.querySelector('.ag-select-scroll') as HTMLDivElement;
        if (scrollEl) {
          this._virtual = this._createVirtualSelect(this.getAllOptionData(), scrollEl);
          // 첫 번째 항목에 포커스 설정
          requestAnimationFrame(() => {
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
      // 단일 선택의 경우 기본값(첫 번째 옵션)으로 설정
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
    }
  };

  public toggleDropdown = (): void => {
    if (this.open) this.closeDropdown();
    else this.openDropdown();
  };

  private initializeOptionsFromPropsOrSlot(): void {
    if (!this.multiple) {
      this._value = null;
    }

    const optionEls = Array.from(this.querySelectorAll('option')) as HTMLOptionElement[];

    if (optionEls.length > 0) {
      this._options = optionEls.map(opt => opt.cloneNode(true) as HTMLOptionElement);
      optionEls.forEach(opt => opt.remove());
    }
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

    if (this.multiple) {
      // 멀티셀렉트의 경우 selected 옵션들을 모두 수집
      const selectedOptions = this._options.filter(opt => opt.selected);
      this._selectedValues = selectedOptions.map(opt => opt.value);
    } else {
      // 단일 선택의 경우 기존 로직 유지
      const selected = this._options.find(opt => opt.selected);
      if (selected) {
        this.value = selected.value;
      } else {
        const fallback = this._options[0];
        if (fallback) {
          this.value = fallback.value;
        }
      }
    }

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

    if (this.multiple) {
      // 멀티셀렉트의 경우 이용 가능한 첫 번째 항목으로 이동
      requestAnimationFrame(() => {
        this._virtual?.setActiveIndex(0);
      });
    } else {
      const selectedIndex = this.getAllOptionData().findIndex((opt) => opt.value === this._value);
      requestAnimationFrame(() => {
        this._virtual?.setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
      });
    }
  }

  public closeDropdown(): void {
    this.open = false;
  }

  private selectOption(value: string, label: string): void {
    if (this.multiple) {
      // 멀티셀렉트의 경우 항상 선택만 함 (이미 선택된 항목은 리스트에 없음)
      this._selectedValues = [...this._selectedValues, value];
      this.updateFormValue();
      this.requestUpdate();

      // Virtual select를 강제로 다시 생성하여 선택된 항목을 리스트에서 즉시 제거
      this._virtual?.destroy();
      this._virtual = null;

      const scrollEl = this.querySelector('.ag-select-scroll') as HTMLDivElement;
      if (scrollEl) {
        this._virtual = this._createVirtualSelect(this.getAllOptionData(), scrollEl);
        // 첫 번째 항목에 포커스 설정
        requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(0);
        });
      }

      this.dispatchEvent(
        new CustomEvent('onSelect', {
          detail: { value, label },
          bubbles: true,
          composed: true,
        })
      );

      // 멀티셀렉트에서는 드롭다운을 닫지 않음
    } else {
      // 단일 선택의 경우 기존 로직
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

  // 새로 추가: 멀티셀렉트를 위한 폼 값 업데이트
  private updateFormValue(): void {
    if (this.multiple) {
      // 멀티셀렉트의 경우 배열을 JSON 문자열로 변환하거나 쉼표로 구분된 문자열로 저장
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
      // 멀티셀렉트의 경우 원본 순서를 유지하면서 선택된 항목들만 제외
      return this._options
        .filter((opt) => !this._selectedValues.includes(opt.value))
        .map((opt) => ({
          value: opt.value,
          label: opt.textContent ?? '',
        }));
    } else {
      // 단일 선택의 경우 모든 옵션 반환
      return this._options.map((opt) => ({
        value: opt.value,
        label: opt.textContent ?? '',
      }));
    }
  }

  public _createVirtualSelect(options: VirtualSelectOption[], container: HTMLDivElement) {
    return new InteractiveVirtualSelect(container, options, {
      renderOption: (el: HTMLElement, opt: VirtualSelectOption) => {
        el.textContent = opt.label;

        // 멀티셀렉트의 경우 선택된 항목에 체크 표시
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
      return -1; // 멀티셀렉트에서는 의미가 없음
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
      // 멀티셀렉트의 경우 쉼표로 구분된 문자열을 배열로 변환
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

  // 새로 추가: 멀티셀렉트를 위한 getter
  get selectedValues(): string[] {
    return this.multiple ? [...this._selectedValues] : [];
  }

  // 새로 추가: 멀티셀렉트를 위한 setter
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