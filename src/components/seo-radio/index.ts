import { LitElement, html } from 'lit'
import './style.scss'

export class AgRadio extends LitElement {
  static formAssociated = true

  static get properties () {
    return {
      id: { type: String },
      name: { type: String },
      value: { type: String },
      options: { type: Array },
      disabled: { type: Boolean, reflect: true }
    }
  }

  declare id: string
  declare name: string
  declare value: string | null
  declare options: { label: string; value: string }[]
  declare disabled: boolean

  private _internals: ElementInternals

  constructor () {
    super()
    this.id = ''
    this.name = ''
    this.value = null
    this.options = []
    this.disabled = false
    this._internals = this.attachInternals()
  }

  protected createRenderRoot () {
    return this
  }

  updated (changed: Map<string, unknown>) {
    if (changed.has('value')) {
      this._internals.setFormValue(this.value)
    }
  }

  private handleChange (e: Event) {
    if (this.disabled) return
    const target = e.target as HTMLInputElement
    this.value = target.value
  }

  render () {
    return html`
      <div class="ag-radio ${this.disabled ? 'is-disabled' : ''}">
        ${this.options.map((opt) => html`
          <label class="radio-label" for="${opt.value}">
            <input
              type="radio"
              id="${opt.value}"
              name="${this.name}"
              value="${opt.value}"
              .checked=${this.value === opt.value}
              .disabled=${this.disabled}
              hidden
              @change=${this.handleChange}
            />
            <svg width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="9"></circle>
              <path class="inner" d="M10,7 C8.343,7 7,8.343 7,10 C7,11.657 8.343,13 10,13 C11.657,13 13,11.657 13,10 C13,8.343 11.657,7 10,7 Z"></path>
              <path class="outer" d="M10,1 C14.97,1 19,5.03 19,10 C19,14.97 14.97,19 10,19 C5.03,19 1,14.97 1,10 C1,5.03 5.03,1 10,1 Z"></path>
            </svg>
            <span class="label-text">${opt.label}</span>
          </label>
        `)}
      </div>
    `
  }
}

customElements.define('ag-radio', AgRadio)
