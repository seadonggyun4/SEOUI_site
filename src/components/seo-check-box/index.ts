import { LitElement, html } from 'lit'
import './style.scss'

export class CheckBox extends LitElement {
  static formAssociated = true

  static get properties () {
    return {
      checked: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      required: { type: Boolean, reflect: true },
      label: { type: String },
      name: { type: String },
      id: { type: String },
    }
  }

  declare checked: boolean
  declare disabled: boolean
  declare required: boolean
  declare label: string
  declare name: string
  declare id: string

  private _value: string | null
  private _internals: ElementInternals

  constructor () {
    super()
    this.checked = false
    this.disabled = false
    this.required = false
    this.label = ''
    this.name = ''
    this.id = ''
    this._value = 'on'

    this._internals = this.attachInternals()
  }

  createRenderRoot () {
    return this
  }

connectedCallback() {
  super.connectedCallback();
  this._updateFormValue();
  this._updateValidity();
}


  updated (changed: Map<string, unknown>) {
    if (changed.has('checked')) {
      this._updateFormValue()
      this._updateValidity()
    }
  }

  private _updateFormValue () {
    this._internals.setFormValue(this.checked ? this._value : null)
  }

  private _updateValidity () {
    const input = this._getInputEl()
    if (this.required && !this.checked) {
      this._internals.setValidity({ valueMissing: true }, '필수 항목입니다.', input)
    } else {
      this._internals.setValidity({})
    }
  }

  private _getInputEl (): HTMLInputElement {
    return this.querySelector('input[type="checkbox"]')!
  }

  private handleChange = (e: Event) => {
    if (this.disabled) return
    const target = e.target as HTMLInputElement
    this.checked = target.checked
  }

  focus () {
    this._getInputEl()?.focus()
  }

  get value () {
    return this.checked ? this._value : null
  }

  set value (val: string | null) {
    this._value = val
  }

  render () {
    return html`
      <label class="checkbox-container ${this.disabled ? 'is-disabled' : ''}">
        <input
          type="checkbox"
          .checked=${this.checked}
          .disabled=${this.disabled}
          tabindex=${this.disabled ? -1 : 0}
          @change=${this.handleChange}
        />
        <div class="styled-checkbox">
          <svg viewBox="0 0 14 12" aria-hidden="true">
            <polyline points="1 7.6 5 11 13 1"></polyline>
          </svg>
        </div>
        ${this.label ? html`<span class="label-text">${this.label}</span>` : null}
      </label>
    `
  }
}

customElements.define('ag-check-box', CheckBox)
