import { html } from 'lit';
import { isMultilingualMatch } from './search';
import { AgSelect } from '../seo-select';

interface OptionItem {
  value: string;
  label: string;
  disabled?: boolean;
}

interface VirtualSelectOption {
  value: string;
  label: string;
}

type SelectTheme = 'basic' | 'float';
type SupportedLanguage = 'en' | 'ko' | 'ja' | 'zh';

// 검색 관련 다국어 텍스트 정의
interface SearchLocalizedTexts {
  searchPlaceholder: string;
  noMatchText: string;
}

const SEARCH_LOCALIZED_TEXTS: Record<SupportedLanguage, SearchLocalizedTexts> = {
  en: {
    searchPlaceholder: 'Search...',
    noMatchText: 'No matching data found.',
  },
  ko: {
    searchPlaceholder: '검색하세요',
    noMatchText: '데이터가 없습니다.',
  },
  ja: {
    searchPlaceholder: '検索してください',
    noMatchText: '一致するデータがありません。',
  },
  zh: {
    searchPlaceholder: '请搜索',
    noMatchText: '未找到匹配数据。',
  }
};

export class AgSelectSearch extends AgSelect {
  static get properties() {
    return {
      ...super.properties,
      _searchText: { type: String },
      _noMatchVisible: { type: Boolean },
      theme: { type: String }, // 부모 클래스에서 상속되지만 명시적으로 선언
      dark: { type: Boolean }, // 다크 모드 prop 추가
    };
  }

  declare _searchText: string;
  declare _noMatchVisible: boolean;
  declare theme: SelectTheme;
  declare dark: boolean; // 다크 모드 속성 추가

  constructor() {
    super();
    this._searchText = '';
    this._noMatchVisible = false;
    this.theme = 'float'; // 기본값은 float
    this.dark = false; // 기본값은 light 모드
  }

  // 검색 관련 다국어 텍스트를 가져오는 헬퍼 메서드
  private getSearchLocalizedText(): SearchLocalizedTexts {
    return SEARCH_LOCALIZED_TEXTS[this.language] || SEARCH_LOCALIZED_TEXTS.en;
  }

  updated(changed: Map<string, unknown>): void {
    super.updated?.(changed);
    if (changed.has('optionItems') || changed.has('_searchText') || changed.has('language')) {
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
    const searchTexts = this.getSearchLocalizedText();
    const hasOptions = this.getAllOptionData().length > 0;
    const showNoData = this.multiple && !this._isLoading && !hasOptions;

    return html`
      <div class="seo-select-listbox ${this.open ? '' : 'hidden'}">
        <div class="select-search-input">
          <span class="search-icon" aria-hidden="true">${this.getSearchIcon()}</span>
          <input
            type="text"
            placeholder="${searchTexts.searchPlaceholder}"
            .value=${this._searchText}
            @input=${this._handleSearchInput}
          />
        </div>
        <div class="seo-select-scroll" role="listbox">
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

  // 부모 클래스의 getThemeClass 메서드를 오버라이드하여 다크 모드 지원
  protected override getThemeClass(): string {
    const themeClass = `theme-${this.theme}`;
    const darkClass = this.dark ? 'dark' : '';
    return `${themeClass} ${darkClass}`.trim();
  }

  render() {
    if (this.multiple) {
      return this.renderMultiSelectSearch();
    } else {
      return this.renderSingleSelectSearch();
    }
  }

  private renderMultiSelectSearch() {
    const texts = this.getLocalizedText(); // 부모 클래스의 다국어 텍스트 사용
    const showResetButton = this.showReset && this._selectedValues.length > 0;

    return html`
      <div class="seo-select multi-select ${this.getThemeClass()} ${this.open ? 'open' : ''}" style="width: ${this.width}; height: ${this.height};">
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
                    title="${texts.removeTag}"
                  >${this.getCloseIcon()}</button>
                </span>
              `;
            })}
            ${this._selectedValues.length === 0
              ? html`<span class="placeholder">${texts.placeholder}</span>`
              : ''
            }
          </div>
          ${showResetButton
            ? html`<button
                type="button"
                class="multi-reset-button"
                @click=${this.resetToDefaultSearch}
                title="${texts.clearAll}"
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
    const texts = this.getLocalizedText(); // 부모 클래스의 다국어 텍스트 사용
    const firstOptionValue = this._options && this._options.length > 0 ? this._options[0].value : null;
    const showResetButton = this.showReset &&
                          this._value !== null &&
                          firstOptionValue !== null &&
                          this._value !== firstOptionValue;

    return html`
      <div class="seo-select ${this.getThemeClass()} ${this.open ? 'open' : ''}" style="width: ${this.width}; height: ${this.height};">
        <button type="button" class="selected ${showResetButton ? 'with-reset' : ''}" @click=${this.toggleDropdown}>
          ${this._labelText}
          ${showResetButton
            ? html`<button
                type="button"
                class="reset-button"
                @click=${this.resetToDefaultSearch}
                title="${texts.resetToDefault}"
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
    const scrollEl = this.querySelector('.seo-select-scroll') as HTMLDivElement;
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

  // null을 undefined로 변환하는 헬퍼 함수
  private getCurrentValue(): string | undefined {
    return this.value ?? undefined;
  }

  // 향상된 다국어 검색 필터 적용
  private _applyFilteredOptions(): void {
    if (!this._virtual) return;

    const searchTexts = this.getSearchLocalizedText();
    const rawInput = this._searchText.trim();
    
    if (!rawInput) {
      this._virtual.setData(this.getAllOptionData(), this.multiple ? undefined : this.getCurrentValue());
      this._noMatchVisible = false;
      return;
    }

    const allOptions: OptionItem[] = this.getAllOptionData();
    
    // 향상된 다국어 검색 적용
    const filtered = allOptions.filter(opt => {
      const label = (opt.label ?? '').toString();
      return isMultilingualMatch(rawInput, label);
    });

    if (filtered.length === 0) {
      this._virtual.setData(
        [{ value: 'no_match', label: searchTexts.noMatchText, disabled: true }],
        this.multiple ? undefined : this.getCurrentValue(),
      );
      return;
    }

    this._virtual.setData(filtered, this.multiple ? undefined : this.getCurrentValue());
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
        const scrollEl = this.querySelector('.seo-select-scroll') as HTMLDivElement;
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
        const scrollEl = this.querySelector('.seo-select-scroll') as HTMLDivElement;
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

        // 드롭다운이 열려있는 경우 즉시 activeIndex와 focusedIndex를 첫 번째로 설정
        if (this.open && this._virtual) {
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
            // 가상 스크롤의 내부 상태도 첫 번째 옵션으로 설정
            if (this._virtual) {
              this._virtual.setActiveAndFocusedIndex(0);
              this._virtual.applyHighlight();
            }
          });
        }

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

  // 부모 클래스의 언어 변경 메서드를 오버라이드하여 검색 관련 UI도 업데이트
  public override setLanguage(language: SupportedLanguage): void {
    super.setLanguage(language);
    // 검색 관련 UI 업데이트를 위해 강제 리렌더링
    this.requestUpdate();
  }

  // 검색 관련 다국어 텍스트를 반환하는 정적 메서드
  static getSearchLocalizedTexts(): Record<SupportedLanguage, SearchLocalizedTexts> {
    return SEARCH_LOCALIZED_TEXTS;
  }

  // 디버깅을 위한 검색 테스트 메서드 (개발용)
  public testMultilingualSearch(searchText: string, targetText: string): boolean {
    return isMultilingualMatch(searchText, targetText);
  }
}

customElements.define('seo-select-search', AgSelectSearch);