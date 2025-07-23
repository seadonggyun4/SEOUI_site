import { html } from 'lit';
import { getChosungAll } from '@/utils/search';
import { AgSelect } from '../ag-select';

interface OptionItem {
  value: string;
  label: string;
  disabled?: boolean;
}

interface VirtualSelectOption {
  value: string;
  label: string;
}

export class AgSelectSearch extends AgSelect {
  static get properties() {
    return {
      ...super.properties,
      _searchText: { type: String },
      _noMatchVisible: { type: Boolean },
    };
  }

  declare _searchText: string;
  declare _noMatchVisible: boolean;

  constructor() {
    super();
    this._searchText = '';
    this._noMatchVisible = false;
  }

  updated(changed: Map<string, unknown>): void {
    super.updated?.(changed);
    if (changed.has('optionItems') || changed.has('_searchText')) {
      this._applyFilteredOptions();
    }
  }

  render() {
    if (this.multiple) {
      return this.renderMultiSelectSearch();
    } else {
      return this.renderSingleSelectSearch();
    }
  }

  private renderMultiSelectSearch() {
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
                  >×</button>
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
              >×</button>`
            : ''
          }
          <span class="arrow">▼</span>
        </div>
        <div class="ag-select-listbox ${this.open ? '' : 'hidden'}">
          <div class="select-search-input">
            <i class="fas fa-search search-icon" aria-hidden="true"></i>
            <input
              type="text"
              placeholder="검색하세요"
              .value=${this._searchText}
              @input=${this._handleSearchInput}
            />
          </div>
          <div class="ag-select-scroll" role="listbox"></div>
        </div>
      </div>
    `;
  }

  private renderSingleSelectSearch() {
    // 부모 클래스와 동일한 reset 버튼 로직 적용
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
        <div class="ag-select-listbox ${this.open ? '' : 'hidden'}">
          <div class="select-search-input">
            <i class="fas fa-search search-icon" aria-hidden="true"></i>
            <input
              type="text"
              placeholder="검색하세요"
              .value=${this._searchText}
              @input=${this._handleSearchInput}
            />
          </div>
          <div class="ag-select-scroll" role="listbox"></div>
        </div>
      </div>
    `;
  }

  public override _createVirtualSelect(options: VirtualSelectOption[], container: HTMLDivElement) {
    const virtual = super._createVirtualSelect(options, container);
    virtual.isitSearch = true;
    return virtual;
  }

  private _handleSearchInput = (e: Event): void => {
    const input = e.target as HTMLInputElement;
    this._searchText = input.value;
  };

  private _applyFilteredOptions(): void {
    const rawInput = this._searchText.toLowerCase().replace(/\s+/g, '');
    if (!rawInput) {
      this._virtual?.setData(this.getAllOptionData(), this.multiple ? null : this.value);
      this._noMatchVisible = false;
      return;
    }

    const searchChosung = getChosungAll(rawInput);
    const searchRegex = new RegExp(searchChosung.split('').join('.*'));

    const allOptions: OptionItem[] = this.getAllOptionData();
    const filtered = allOptions.filter(opt => {
      const label = (opt.label ?? '').toString().toLowerCase().replace(/\s+/g, '');
      const labelChosung = getChosungAll(label);
      return searchRegex.test(labelChosung);
    });

    if (filtered.length === 0) {
      this._virtual?.setData(
        [{ value: 'no_match', label: '데이터가 없습니다.', disabled: true }],
        this.multiple ? null : this.value,
      );
      return;
    }

    this._virtual?.setData(filtered, this.multiple ? null : this.value);
  }

  // 태그 제거 함수 - 부모 클래스의 removeTag와 동일하지만 검색 필터 적용
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
        // 검색 텍스트가 있다면 필터 적용
        if (this._searchText) {
          this._applyFilteredOptions();
        }
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

  // resetToDefault 오버라이드 - 다중선택 지원 및 검색 필터 적용
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
          // 검색 텍스트가 있다면 필터 적용
          if (this._searchText) {
            this._applyFilteredOptions();
          }
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

  public closeDropdown(): void {
    super.closeDropdown();
    this._searchText = '';
    this._noMatchVisible = false;
  }
}

customElements.define('ag-select-search', AgSelectSearch);