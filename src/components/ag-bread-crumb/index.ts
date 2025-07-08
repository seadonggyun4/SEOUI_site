import { LitElement, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

interface BreadcrumbItem {
  label: string;
  path: string;
}

export class AgBreadcrumb extends LitElement {
  static get properties() {
    return {
      items: { type: Array },
      root: { type: String },
      currentUrl: { type: String },
    };
  }

  declare items: BreadcrumbItem[];
  declare root: string;
  declare currentUrl: string;

  constructor() {
    super();
    this.items = [];
    this.root = '/';
    this.currentUrl = '/';
  }

  createRenderRoot() {
    return this; // Light DOM 사용
  }

  render() {
    return html`
      <nav class="ag-breadcrumb__wrapper" aria-label="Breadcrumb">
        <ol class="ag-breadcrumb__list">
          <li class="ag-breadcrumb__item">
            <a
              class="ag-breadcrumb__link ${this.isActive(this.root) ? 'active' : ''}"
              href="${this.root}"
              aria-current=${ifDefined(this.isActive(this.root) ? 'page' : undefined)}
            >
              <svg class="ag-breadcrumb__home-icon" width="16" height="16" viewBox="0 0 576 512">
                <path
                  d="M541 229.16l-61-52.91V56a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v51.63L314.45 43.19a35.34 35.34 0 0 0-47.06 0L35 229.16a8 8 0 0 0-1 11.31l25.5 28.5a8 8 0 0 0 11.31 1l30.19-26.2V456a24 24 0 0 0 24 24h112a8 8 0 0 0 8-8V344a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v128a8 8 0 0 0 8 8h112a24 24 0 0 0 24-24V243.77l30.19 26.2a8 8 0 0 0 11.31-1l25.5-28.5a8 8 0 0 0-1-11.31z"
                />
              </svg>
            </a>
          </li>
          ${this.items.map(
            (item) => html`
              <li class="ag-breadcrumb__item">
                <a
                  class="ag-breadcrumb__link ${this.isActive(item.path) ? 'active' : ''}"
                  href="${item.path || 'javascript:void(0)'}"
                  aria-current=${ifDefined(this.isActive(item.path) ? 'page' : undefined)}
                >
                  ${item.label}
                </a>
              </li>
            `
          )}
        </ol>
      </nav>
    `;
  }

  isActive(path: string): boolean {
    return this.currentUrl === path;
  }
}

customElements.define('ag-breadcrumb', AgBreadcrumb);
