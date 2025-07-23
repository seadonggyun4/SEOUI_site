export class InteractiveVirtualSelect {
  static activeInstance = null;

  constructor(container, data, options = {}) {
    this.container = container;
    this.data = data;
    this.rowHeight = options.rowHeight || 36;
    this.overscan = options.overscan || 20;
    this.renderOption = options.renderOption || null;
    this.onClick = options.onClick || null;
    this.onEscape = options.onEscape || null;

    this.total = data.length;
    this.focusedIndex = -1;
    this.activeIndex = -1;
    this._prevStart = -1;
    this._prevEnd = -1;
    this.pool = [];

    this._ensureWrapper();
    this._buildDOM();

    requestAnimationFrame(() => {
      this._initializeContainer();
      this._buildPool();
      this._bindScroll();

      if (InteractiveVirtualSelect.activeInstance && InteractiveVirtualSelect.activeInstance !== this) {
        InteractiveVirtualSelect.activeInstance.deactivate();
      }

      InteractiveVirtualSelect.activeInstance = this;
      this.render();
    });
  }

  // 활성화 해제: 모든 하이라이트 클래스 제거
  deactivate() {
    this.pool.forEach(this._resetClass);
  }

  // 주어진 인덱스로 스크롤 이동 및 렌더링
  renderToIndex(index) {
    const clamped = Math.max(0, Math.min(index, this.total - 1));
    const halfVisible = Math.floor(this.visibleCount / 2);
    const startIdx = Math.max(0, clamped - halfVisible);
    const scrollTop = startIdx * this.rowHeight;

    // 너무 자주 조정되지 않도록 오차 허용
    if (Math.abs(this.container.scrollTop - scrollTop) > 1) this.container.scrollTop = scrollTop;

    this.render();
  }

  // wrapper 엘리먼트를 보장
  _ensureWrapper() {
    this.wrapper = this.container.querySelector('.option-wrapper') || document.createElement('div');
    this.wrapper.className = 'option-wrapper';
    if (!this.wrapper.parentElement) this.container.appendChild(this.wrapper);
    this.wrapper.innerHTML = '';
  }

  // 가상 리스트용 padding 영역 생성
  _buildDOM() {
    this.topPad = document.createElement('div');
    this.topPad.className = 'virtual-placeholder top';
    this.topPad.appendChild(document.createElement('div'));

    this.botPad = document.createElement('div');
    this.botPad.className = 'virtual-placeholder bottom';
    this.botPad.appendChild(document.createElement('div'));

    this.wrapper.append(this.topPad, this.botPad);
  }

  // 컨테이너 및 풀 크기 초기화
  _initializeContainer(extraHeight = 0) {
    const maxHeight = 360;
    const computedHeight = this.total * this.rowHeight;
    const finalHeight = this.total > 10 ? maxHeight : computedHeight;

    this.container.style.height = `${finalHeight + 5 + extraHeight}px`;
    this.visibleCount = Math.max(1, Math.ceil((finalHeight + extraHeight) / this.rowHeight));
    this.poolSize = this.visibleCount + this.overscan * 2;
    this.container.style.setProperty('--row-height', `${this.rowHeight}px`);
    this.wrapper.style.height = `${this.total * this.rowHeight}px`;
  }

  // option 요소 풀 구성
  _buildPool() {
    this.pool.forEach(el => el.remove());
    this.pool = [];
    const insertAfter = this.topPad.nextSibling;

    for (let i = 0; i < this.poolSize; i++) {
      const el = this._createOptionElement();
      this.pool.push(el);
      this.wrapper.insertBefore(el, insertAfter);
    }
  }

  // 스크롤 이벤트 바인딩
  _bindScroll() {
    this._ticking = false;
    this._prevStartIdx = -1;

    this._onScroll = () => {
      if (!this._isVisible()) return;

      const scrollTop = this.container.scrollTop;
      const startIdx = Math.floor(scrollTop / this.rowHeight);

      if (startIdx === this._prevStartIdx) return;
      this._prevStartIdx = startIdx;

      if (!this._ticking) {
        this._ticking = true;
        requestAnimationFrame(() => {
          this.render();
          this._ticking = false;
        });
      }
    };

    this.container.addEventListener('scroll', this._onScroll, { passive: true });
  }

  // 현재 표시 상태 여부 확인
  _isVisible() {
    return this.container.offsetParent !== null && this.container.offsetHeight > 0;
  }

  // 가상 리스트 렌더링
  render() {
    const scrollTop = this.container.scrollTop;
    const startIdx = Math.max(0, Math.floor(scrollTop / this.rowHeight) - this.overscan);
    const endIdx = Math.min(this.total, startIdx + this.poolSize);
    const sameRange = this._prevStart === startIdx && this._prevEnd === endIdx;

    if (!sameRange) {
      this._prevStart = startIdx;
      this._prevEnd = endIdx;
      this._setPlaceholders(startIdx, endIdx);
      this._renderPool(startIdx);

      requestAnimationFrame(() => {
        const delta = Math.abs(this.container.scrollTop - scrollTop);
        if (delta > 1) this.container.scrollTop = scrollTop;
        this._applyHighlight();
      });
    }
    this._applyHighlight();
  }

  // index로 활성화 설정
  setActiveIndex(index) {
    if (index < 0 || index >= this.total) return;
    this.activeIndex = index;
    this.focusedIndex = index;
    this.renderToIndex(index);
  }

  // padding 영역 설정
  _setPlaceholders(startIdx, endIdx) {
    const topPad = startIdx * this.rowHeight;
    const botPad = (this.total - endIdx) * this.rowHeight;
    this.container.style.setProperty('--top-placeholder', `${topPad}px`);
    this.container.style.setProperty('--bottom-placeholder', `${botPad}px`);
    this.topPad.firstElementChild.style.height = `${topPad}px`;
    this.botPad.firstElementChild.style.height = `${botPad}px`;
    this.wrapper.style.height = `${this.total * this.rowHeight}px`;
  }

  // 옵션 풀 재사용하여 렌더링
  _renderPool(startIdx) {
    for (let i = 0; i < this.pool.length; i++) {
      const el = this.pool[i];
      const dataIdx = startIdx + i;

      if (dataIdx >= this.total) {
        el.style.display = 'none';
        el.removeAttribute('data-index');
        continue;
      }

      const option = this.data[dataIdx];
      el.style.display = '';
      el.dataset.index = String(dataIdx);
      if (el._value !== option.value) {
        el.textContent = option.label;
        el._value = option.value;
      }
      this._handleDisabledOption(el, option);
      this._resetClass(el);
    }
  }

  // 강조 클래스 적용
  _applyHighlight() {
    for (const el of this.pool) {
      const idx = parseInt(el.dataset.index || '-1', 10);
      if (!Number.isFinite(idx)) continue;
      el.classList.toggle('active', idx === this.activeIndex);
      el.classList.toggle('focused', idx === this.focusedIndex);
    }
  }

  // 비활성 옵션 처리
  _handleDisabledOption(el, opt) {
    const isDisabled = opt?.value === 'no_match';
    el.classList.toggle('disabled', isDisabled);
    el.toggleAttribute('aria-disabled', isDisabled);
    if (isDisabled) this.container.style.height = '80px';
  }

  // 강조 클래스 초기화
  _resetClass(el) {
    el.classList.remove('active', 'focused');
  }

  // 옵션 엘리먼트 생성
  _createOptionElement() {
    const el = document.createElement('option');
    el.className = 'option';
    el.style.height = 'var(--row-height)';
    el.addEventListener('click', (e) => this._handleClick(e, el));

    el.addEventListener('mouseenter', () => {
      const idx = parseInt(el.dataset.index || '-1', 10);
      if (!Number.isFinite(idx)) return;
      this.focusedIndex = idx;
      this._applyHighlight();
    });
    return el;
  }

  // 클릭 이벤트 처리
  _handleClick(e, el) {
    const index = parseInt(el.dataset.index || '-1', 10);
    const option = this.data[index];
    if (option?.value === 'no_match') return;
    this.onClick?.(option, index, e);
    this.activeIndex = index;
    this.focusedIndex = index;
    this._applyHighlight();
  }

  // 키보드 입력 처리
  handleKeydown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'Tab': {
        e.preventDefault();
        const nextIndex = this.focusedIndex + 1;
        if (this.data[nextIndex]?.value === 'no_match') return;
        if (nextIndex >= this.total) {
          const maxScrollTop = this.container.scrollHeight - this.container.clientHeight;
          this.container.scrollTop = maxScrollTop;
        } else {
          this.setFocusedIndex(nextIndex);
        }
        break;
      }
      case 'ArrowUp':
        e.preventDefault();
        if (this.data[0]?.value === 'no_match') return;
        this.setFocusedIndex(this.focusedIndex - 1);
        break;
      case 'Enter': {
        e.preventDefault();
        const opt = this.getFocusedOption();
        if (opt) {
          this.onClick?.(opt, this.focusedIndex, e);
          this.activeIndex = this.focusedIndex;
          this._applyHighlight();
        }
        break;
      }
      case 'Escape':
        e.preventDefault();
        this.onEscape?.();
        break;
    }
  };

  // 포커스 인덱스 설정
  setFocusedIndex(index) {
    this.focusedIndex = Math.max(0, Math.min(index, this.total - 1));
    this.render();
    this._scrollIntoView(this.focusedIndex);
  }

  // 포커스된 아이템이 보이도록 스크롤
  _scrollIntoView(index) {
    const offset = this.total > 10 ? 9 : this.total - 1; // 몇 번째 줄에 고정할지 (0: top, 1: 한 줄 아래)
    const top = (index - offset) * this.rowHeight;
    const minScroll = Math.max(0, top);
    this.container.scrollTop = minScroll;
  }

  // 현재 포커스된 옵션 반환
  getFocusedOption() {
    return this.focusedIndex >= 0 && this.focusedIndex < this.data.length
      ? this.data[this.focusedIndex]
      : null;
  }

  // 데이터 갱신 및 렌더링
  setData(newData, activeValue) {
    this.data = newData;
    this.total = newData.length;
    this._prevStart = -1;
    this._prevEnd = -1;

    const matchedIndex = activeValue != (null | undefined)
      ? this.data.findIndex(opt => opt.value === activeValue)
      : -1;

    this.activeIndex = matchedIndex;
    this.focusedIndex = matchedIndex;
    this.container.scrollTop = 0;

    this._initializeContainer();
    this._setPlaceholders(0, Math.min(this.total, this.pool.length));
    this._renderPool(0);
    this._applyHighlight();
  }

  // 파괴 및 이벤트 제거
  destroy() {
    this.container.removeEventListener('scroll', this._onScroll);
    this.pool.forEach(el => el.remove());
    this.wrapper.style.height = 0;
    this.topPad?.remove();
    this.botPad?.remove();
    this.pool = [];
    if (InteractiveVirtualSelect.activeInstance === this) {
      InteractiveVirtualSelect.activeInstance = null;
    }
  }
}