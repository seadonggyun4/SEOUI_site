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

// No need for global interface extension

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

  private getSearchIcon() {
    return html`
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 14L11.1 11.1" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  // 검색 기능이 있는 드롭다운 렌더링 - 부모 클래스의 로딩/데이터없음 처리 포함
  private renderSearchDropdown() {
    const hasOptions = this.getAllOptionData().length > 0;
    const showNoData = this.multiple && !this._isLoading && !hasOptions;

    return html`
      <div class="ag-select-listbox ${this.open ? '' : 'hidden'}">
        <div class="select-search-input">
          <span class="search-icon" aria-hidden="true">${this.getSearchIcon()}</span>
          <input
            type="text"
            placeholder="검색하세요"
            .value=${this._searchText}
            @input=${this._handleSearchInput}
          />
        </div>
        <div class="ag-select-scroll" role="listbox">
          ${this._isLoading
            ? this.renderLoadingSpinner()
            : showNoData
              ? this.renderNoData()
              : ''
          }
        </div>
      </div>
    `;
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
                    @click=${(e: Event) => this.removeTagSearch(e, value)}
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
                @click=${this.resetToDefaultSearch}
                title="모두 지우기"
              >${this.getCloseIcon()}</button>`
            : ''
          }
          <span class="arrow">${this.open ? this.getChevronUpIcon() : this.getChevronDownIcon()}</span>
        </div>
        ${this.renderSearchDropdown()}
      </div>
    `;
  }

  private renderSingleSelectSearch() {
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
                @click=${this.resetToDefaultSearch}
                title="기본값으로 되돌리기"
              >${this.getCloseIcon()}</button>`
            : ''
          }
          <span class="arrow">${this.open ? this.getChevronUpIcon() : this.getChevronDownIcon()}</span>
        </button>
        ${this.renderSearchDropdown()}
      </div>
    `;
  }

  public override _createVirtualSelect(options: VirtualSelectOption[], container: HTMLDivElement) {
    const virtual = super._createVirtualSelect(options, container);
    if (virtual) {
      // Use type assertion to add the property
      (virtual as any).isitSearch = true;
    }
    return virtual;
  }

  // 가상 스크롤 초기화 - 부모 클래스 메서드 오버라이드하여 검색 처리 추가
  protected override initializeVirtualSelect(): void {
    const scrollEl = this.querySelector('.ag-select-scroll') as HTMLDivElement;
    const optionData = this.getAllOptionData();

    // 다중선택에서 모든 항목이 선택된 경우 가상 스크롤 생성하지 않음
    if (this.multiple && optionData.length === 0) {
      return;
    }

    if (!this._virtual && scrollEl && !this._isLoading && optionData.length > 0) {
      this._virtual = this._createVirtualSelect(optionData, scrollEl);

      // 검색 텍스트가 있으면 필터 적용
      if (this._searchText) {
        this._applyFilteredOptions();
      }

      if (this.multiple) {
        requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(0);
        });
      } else {
        const selectedIndex = optionData.findIndex((opt) => opt.value === this._value);
        requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        });
      }
    }
  }

  private _handleSearchInput = (e: Event): void => {
    const input = e.target as HTMLInputElement;
    this._searchText = input.value;
  };

  private _applyFilteredOptions(): void {
    if (!this._virtual) return;

    const rawInput = this._searchText.toLowerCase().replace(/\s+/g, '');
    if (!rawInput) {
      this._virtual.setData(this.getAllOptionData(), this.multiple ? null : this.value);
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
      this._virtual.setData(
        [{ value: 'no_match', label: '데이터가 없습니다.', disabled: true }],
        this.multiple ? null : this.value,
      );
      return;
    }

    this._virtual.setData(filtered, this.multiple ? null : this.value);
  }

  // Renamed to avoid conflict with parent class method
  private removeTagSearch = (e: Event, valueToRemove: string): void => {
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
          if (this._searchText) {
            this._applyFilteredOptions();
          }
          requestAnimationFrame(() => {
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

  // Renamed to avoid conflict with parent class method
  private resetToDefaultSearch = (e: Event): void => {
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
          if (this._searchText) {
            this._applyFilteredOptions();
          }
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

  public override closeDropdown(): void {
    super.closeDropdown();
    this._searchText = '';
    this._noMatchVisible = false;
  }
}

customElements.define('ag-select-search', AgSelectSearch);