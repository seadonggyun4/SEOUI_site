import { LitElement, html } from 'lit';

export class AgTabList extends LitElement {
  static get properties() {
    return {
      tabs: { type: Array },
      selected: { type: String, reflect: true },
    };
  }

  declare tabs: { label: string; value: string }[];
  declare selected: string;

  constructor() {
    super();
    this.tabs = [];
    this.selected = '';
  }

  createRenderRoot() {
    return this; // Light DOM
  }

  private handleTabClick(value: string) {
    if (this.selected !== value) {
      this.selected = value;
      this.dispatchEvent(
        new CustomEvent('onClick', {
          detail: { value },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    return html`
      <ul class="tab-list">
        ${this.tabs.map(
          (tab) => html`
            <li
              class="ag-tab ${this.selected === tab.value ? 'active' : ''}"
              @click=${() => this.handleTabClick(tab.value)}
            >
              ${tab.label}
            </li>
          `
        )}
      </ul>
    `;
  }
}

// define custom element
if (!customElements.get('ag-tab')) {
  customElements.define('ag-tab', AgTabList);
}