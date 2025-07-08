import { LitElement, PropertyValues } from 'lit'

type ButtonType = 'button' | 'submit' | 'reset'

function makeTrackedPromise<T>(promise: Promise<T>) {
  const tracked = {
    _pending: true,
    promise: promise.finally(() => {
      tracked._pending = false
    }),
    isPending() {
      return tracked._pending
    }
  }

  return tracked
}

export class AgButton extends LitElement {
  static formAssociated = true

  static get observedAttributes() {
    return ['id', 'name', 'type', 'disabled', 'width', 'height', 'variant', 'size', 'throttleTime']
  }

  private _id = ''
  private _name = ''
  private _type: ButtonType = 'button'
  private _disabled = false
  private _width = '100%'
  private _height = '100%'
  private _variant = 'primary'
  private _size = ''
  private _throttleTime = 500

  private _promise: Promise<unknown> | null = null
  private _tracked: {
    isPending: () => boolean
    promise: Promise<unknown>
  } | null = null
  private _loading = false

  private _buttonEl!: HTMLButtonElement
  private _textSpan!: HTMLSpanElement

  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    switch (name) {
      case 'id':
        this._id = newValue ?? ''
        break
      case 'name':
        this._name = newValue ?? ''
        break
      case 'type':
        if (newValue === 'submit' || newValue === 'reset') {
          this._type = newValue
        } else {
          this._type = 'button'
        }
        break
      case 'disabled':
        this._disabled = newValue !== null
        break
      case 'width':
        this._width = newValue ?? '100%'
        break
      case 'height':
        this._height = newValue ?? '100%'
        break
      case 'variant':
        this._variant = newValue ?? 'primary'
        break
      case 'size':
        this._size = newValue ?? ''
        break
      case 'throttleTime':
        this._throttleTime = parseInt(newValue || '500', 10)
        break
    }

    if (this._buttonEl) {
      this._buttonEl.disabled = this._disabled || this._loading
    }
  }

  set promise(p: Promise<unknown> | null) {
    if (!p) return

    this._tracked = makeTrackedPromise(p)
    this._syncLoadingState()
    this._tracked.promise.finally(() => {
      this._syncLoadingState()
    })
  }

  get promise(): Promise<unknown> | null {
    return this._promise
  }

  get value(): string {
    return this._textSpan?.textContent || ''
  }

  set value(val: string) {
    if (this._textSpan) {
      this._textSpan.textContent = val
    }
  }

  protected createRenderRoot() {
    return this // Light DOM
  }

  firstUpdated() {
    const button = document.createElement('button')
    this._buttonEl = button

    button.type = this._type
    button.classList.add('ag-button')
    if (this._variant) button.classList.add(this._variant)
    if (this._size) button.classList.add(this._size)
    if (this._loading) button.classList.add('hide-text')

    button.disabled = this._disabled || this._loading
    button.style.width = this._width
    button.style.height = this._height
    button.addEventListener('click', this.handleClick)

    const spinner = document.createElement('span')
    spinner.className = 'spinner'
    if (this._loading) spinner.classList.add('show')
    button.appendChild(spinner)

    const span = document.createElement('span')
    span.className = 'text'
    span.textContent = this.textContent?.trim() || ''
    this._textSpan = span
    button.appendChild(span)

    const extras = Array.from(this.childNodes).filter(n => n.nodeType !== Node.TEXT_NODE)
    button.append(...extras)

    this.innerHTML = ''
    this.appendChild(button)
  }

  protected updated(changed: PropertyValues) {
    if (!this._buttonEl) return

    if (changed.has('disabled')) {
      this._buttonEl.disabled = this._disabled
    }
  }

  private handleClick = (e: MouseEvent) => {
    if (this._disabled || this._loading) {
      e.preventDefault()
      return
    }
  }

  private _syncLoadingState() {
    this._loading = this._tracked?.isPending() ?? false
    this._updateLoadingClass()
  }

  private _updateLoadingClass() {
    if (!this._buttonEl) return
    const spinner = this._buttonEl.querySelector('.spinner')

    if (this._loading) {
      this._buttonEl.classList.add('hide-text')
      spinner?.classList.add('show')
      this._buttonEl.disabled = true
    } else {
      this._buttonEl.classList.remove('hide-text')
      spinner?.classList.remove('show')
      this._buttonEl.disabled = this._disabled
    }
  }

  render() {
    return null
  }
}

customElements.define('ag-button', AgButton)

