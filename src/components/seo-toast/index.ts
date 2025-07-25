import { LitElement, html } from 'lit';
import './style.scss'

export class AgToast extends LitElement {
  static get properties() {
    return {
      closeTime: { type: Number }
    };
  }

  createRenderRoot() {
    return this; // Light DOM 사용
  }

  private messageCache = new Map<string, { timestamp: number; count: number }>();
  private toastMap = new Map<string, HTMLDivElement>();
  private readonly CACHE_EXPIRATION = 10000;
  private cleanupInterval: number;

  constructor() {
    super();
    (this as any).closeTime = 2000;
    this.cleanupInterval = window.setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.messageCache.entries()) {
        if (now - value.timestamp > this.CACHE_EXPIRATION) {
          this.messageCache.delete(key);
          this.toastMap.delete(key);
        }
      }
    }, 5000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.cleanupInterval);
  }

  render() {
    return html`<div class="toast-container"></div>`;
  }

  private get container(): HTMLDivElement {
    return this.querySelector('.toast-container') || this._initContainer();
  }

  private _initContainer(): HTMLDivElement {
    const div = document.createElement('div');
    div.className = 'toast-container';
    this.appendChild(div);
    return div;
  }

  public showToast(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    options?: { closeTime?: number }
  ) {
    const key = `${type}:${message}`;
    const now = Date.now();
    const cached = this.messageCache.get(key);

    if (cached && now - cached.timestamp < (options?.closeTime ?? (this as any).closeTime)) {
      cached.count += 1;
      cached.timestamp = now;

      const toast = this.toastMap.get(key);
      if (toast) {
        const counterEl = toast.querySelector('.toast__count');
        if (counterEl) counterEl.textContent = `${cached.count}회 발생`;
      }

      return;
    }

    this.messageCache.set(key, { timestamp: now, count: 1 });

    const toast = document.createElement('div');
    toast.className = `toast toast--${type} toast--enter`;

    const iconMap: Record<string, string> = {
      success: 'fa-solid fa-circle-check',
      error: 'fa-solid fa-circle-xmark',
      info: 'fa-solid fa-circle-info',
      warning: 'fa-solid fa-triangle-exclamation',
    };
    const iconClass = iconMap[type] || 'fa-solid fa-circle-info';

    toast.innerHTML = `
      <div class="toast__icon-wrapper">
        <i class="${iconClass}"></i>
      </div>
      <div class="toast__message" role="alert">
        <div class="toast__title">
          알림
          <span class="toast__count"></span>
        </div>
        <div class="toast__desc">${message}</div>
      </div>
      <button class="toast__close" type="button" aria-label="닫기">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    this.container.prepend(toast);
    this.toastMap.set(key, toast);

    requestAnimationFrame(() => {
      toast.classList.remove('toast--enter');
    });

    const closeToast = () => {
      toast.classList.add('toast--exit');
      toast.addEventListener(
        'transitionend',
        () => {
          toast.remove();

          this.dispatchEvent(
            new CustomEvent('onClose', {
              detail: {
                message,
                type,
                count: this.messageCache.get(key)?.count ?? 1,
              },
              bubbles: true,
              composed: true,
            })
          );

          this.messageCache.delete(key);
          this.toastMap.delete(key);
        },
        { once: true }
      );
    };

    toast.querySelector('.toast__close')?.addEventListener('click', closeToast);
    setTimeout(closeToast, options?.closeTime ?? (this as any).closeTime);
  }
}

customElements.define('seo-toast', AgToast);
