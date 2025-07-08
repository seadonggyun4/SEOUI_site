import { LitElement } from 'lit';

export class AgTable extends LitElement {
  private $table: HTMLTableElement | null = null;
  private $thead: HTMLTableSectionElement | null = null;
  private $scroll: HTMLDivElement | null = null;

  public onDelete: ((e: MouseEvent) => void) | null = null;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.wrapContent();
    this.initReferences();
    this.setupHeaderShadowEffect();
  }

  private wrapContent() {
    if (this.querySelector('.ag-table-scroll')) return;

    const $wrap = document.createElement('div');
    $wrap.className = 'ag-table-scroll';
    $wrap.append(...Array.from(this.childNodes));
    this.appendChild($wrap);

    this.$scroll = $wrap;
    this.classList.add('ag-table');
  }

  private initReferences() {
    this.$table = this.querySelector('table');
    this.$thead = this.$table?.querySelector('thead') ?? null;
  }

  private setupHeaderShadowEffect() {
    if (!this.$scroll || !this.$thead) return;

    const toggleShadow = () => this.$thead!.classList.toggle('scrolling', this.$scroll!.scrollTop > 0);
    this.$scroll.addEventListener('scroll', toggleShadow);

    toggleShadow();
  }
}

customElements.define('ag-table', AgTable);
