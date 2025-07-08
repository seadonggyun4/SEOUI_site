import { LitElement, html } from 'lit';

export class AgWindow extends LitElement {
  private _initialChildren: Node[] = [];

  constructor() {
    super();
  }

  connectedCallback() {
    this._initialChildren = Array.from(this.childNodes);
    super.connectedCallback();
  }

  protected createRenderRoot() {
    return this; // Light-DOM: 기본 form 동작 보존
  }

  render() {
    return html`
      <div class="ag-window">
        <div class="head">
          <div class="buttons">
            <div class="button" style="background-color: #fb5a59;"></div>
            <div class="button" style="background-color: #ffc139;"></div>
            <div class="button" style="background-color: #60d045;"></div>
          </div>
          <div class="tabs-group">
            <div class="tab-item active">
              <p class="text"></p>
              <div class="close-button"></div>
            </div>
          </div>
        </div>

        <div class="menu">
          <div class="icons">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" fill="none" />
            </svg>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" />
            </svg>
          </div>
          <div class="search"></div>
        </div>

        <div class="content">
          ${this._initialChildren}
        </div>
      </div>
    `;
  }
}

// 커스텀 엘리먼트 등록
if (!customElements.get('ag-window')) {
  customElements.define('ag-window', AgWindow);
}
