import { LitElement, html } from 'lit'

export class AgSearchPage extends LitElement {
  static formAssociated = true

  declare id: string
  declare label: string
  declare placeholder: string
  declare name: string
  declare disabled: boolean
  declare required: boolean
  declare trigger: HTMLElement | null

  declare _sortKey: string
  declare _sortOrder: 'asc' | 'desc'
  declare _value: string
  declare _columns: string[]
  declare _columnsId?: string
  declare searchAll: boolean

  private internals: ElementInternals
  private inputEl!: HTMLInputElement
  private searchBoxEl!: HTMLDivElement
  private dataMap = new Map<string, string>()

  constructor() {
    super()
    this.id = ''
    this.label = ''
    this.placeholder = '검색'
    this.name = ''
    this.disabled = false
    this.required = false
    this.trigger = null

    this._sortKey = ''
    this._sortOrder = 'asc'
    this._value = ''
    this._columns = []
    this.searchAll = true

    this.internals = this.attachInternals()
    this.hidden = true
  }

  protected createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('click', this._handleClickOutside, true)
    window.addEventListener('keydown', this._handleKeydownEscape, true)
    this.addEventListener('keydown', this._stopEventPropagation, { capture: true })
  }

  disconnectedCallback() {
    window.removeEventListener('click', this._handleClickOutside, true)
    window.removeEventListener('keydown', this._handleKeydownEscape, true)
    this.removeEventListener('keydown', this._stopEventPropagation, true)
    super.disconnectedCallback()
  }

  firstUpdated() {
    this.inputEl = this.querySelector('input') as HTMLInputElement
    this.searchBoxEl = this.querySelector('.ag-search-box') as HTMLDivElement
  }

  show(triggerEl: HTMLElement, contentSectionEl: HTMLElement | null = null) {
    const content = contentSectionEl || document.getElementById('content_section')
    if (!triggerEl || !content) return

    this.removeAttribute('hidden')
    this.trigger = triggerEl

    this.searchBoxEl.classList.remove('exit')
    this.searchBoxEl.classList.add('enter')

    this.updateComplete.then(() => {
      requestAnimationFrame(() => {
        const boxWidth = this.searchBoxEl.offsetWidth
        const boxHeight = this.searchBoxEl.offsetHeight
        const contentRect = content.getBoundingClientRect()
        const scrollY = window.scrollY
        const scrollX = window.scrollX

        const top = contentRect.top + scrollY + (contentRect.height - boxHeight) / 2
        const left = contentRect.left + scrollX + (contentRect.width - boxWidth) / 2

        this.searchBoxEl.style.top = `${top}px`
        this.searchBoxEl.style.left = `${left}px`

        this.inputEl.focus()
      })
    })
  }

  hide() {
    this.searchBoxEl.classList.replace('enter', 'exit')
    this.trigger = null
    this._value = ''
    this.inputEl.value = ''

    const onExitEnd = (e: AnimationEvent) => {
      if (e.animationName === 'slideUp') {
        this.setAttribute('hidden', '')
        this.searchBoxEl.removeEventListener('animationend', onExitEnd)
      }
    }

    this.searchBoxEl.addEventListener('animationend', onExitEnd)

    const target = this.id ?? this.name
    this.dispatchEvent(new CustomEvent('close', {
      detail: { target },
      bubbles: true,
      composed: true
    }))
  }

  private _stopEventPropagation = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopImmediatePropagation()
    }
  }

  private _handleClickOutside = (e: MouseEvent) => {
    const path = e.composedPath()
    const insideSearch = path.includes(this)
    const insideTrigger = this.trigger && path.includes(this.trigger)

    if (!insideSearch && !insideTrigger) {
      this.hide()
    }
  }

  private _handleKeydownEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.searchBoxEl.classList.contains('enter')) {
      this.hide()
    }
  }

  private _handleInputKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      this._commitInputValue()
    }
  }

  private _updateFormValue(e: Event) {
    const val = (e.target as HTMLInputElement).value
    this._value = val
    this.internals.setFormValue(val)
    this.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }))
  }

  private _commitInputValue() {
    const flatKeys: string[] = []

    const keyword = this._value.trim()
    const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(safeKeyword, 'i')

    for (const key of this.dataMap.keys()) {
      const data = this.dataMap.get(key)
      if (!data) continue
      if (regex.test(data)) flatKeys.push(key)
    }

    const target = this.id ?? this.name
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        target,
        searchAll: this.searchAll,
        columns: this._columns,
        searchKeys: flatKeys
      },
      bubbles: true,
      composed: true
    }))
  }

  public buildDataMap(rowdata: Record<string, any>[], columns: string[] = [], columnsId?: string) {
    this._columns = columns
    this._columnsId = columnsId
    this.searchAll = columns.length === 0
    this.dataMap.clear()

    for (const row of rowdata) {
      const key = row.id ?? row[columnsId ?? '']
      if (key === undefined) return

      const searchFields = this.searchAll
        ? Object.values(row)
        : columns.map(col => row[col])
      const searchKey = searchFields.filter(Boolean).join(' ').trim()
      if (searchKey) this.dataMap.set(key, searchKey)
    }
  }

  render() {
    return html`
      <div class="ag-search-box">
        ${this.label
          ? html`<label for="${this.id}">${this.label}</label>`
          : null}

        <div class="search-input">
          <i class="fa fa-search"></i>
          <input
            id="${this.id}"
            type="text"
            placeholder="${this.placeholder}"
            .value=${this._value}
            name=${this.name}
            ?disabled=${this.disabled}
            ?required=${this.required}
            @input=${this._updateFormValue.bind(this)}
            @keydown=${this._handleInputKeydown.bind(this)}
            @change=${(e: Event) => e.stopImmediatePropagation()}
          />
        </div>

        <button type="button" @click=${this._commitInputValue.bind(this)}>
          검색
        </button>
      </div>
    `
  }
}

customElements.define('ag-search-page', AgSearchPage)
