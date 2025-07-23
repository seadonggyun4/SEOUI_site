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
    return html`
      <div class="ag-select" style="width: ${this.width}; height: ${this.height};">
        <button type="button" class="selected" @click=${this.toggleDropdown}>
          ${this._labelText}
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
      this._virtual?.setData(this.getAllOptionData(), this.value);
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
        this.value,
      );
      return
    }

    this._virtual?.setData(filtered, this.value);
  }

  public closeDropdown(): void {
    super.closeDropdown();
    this._searchText = '';
    this._noMatchVisible = false;
  }
}

customElements.define('ag-select-search', AgSelectSearch);
