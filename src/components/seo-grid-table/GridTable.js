import formatter from '@/components/seo-grid-table/formatter.js'

/**
 * GridDataTable
 */
export class GridDataTable {
  constructor(table, data, columns, options = {}) {
    this.table = table;
    this.container = table.parentElement;
    this.gridDataTable = this.container.parentElement;
    this.tbody = table.tBodies[0];
    this.columns = columns;
    this.rowHeight = options.rowHeight || 35;
    this.overscan = options.overscan || 10;
    this.cancelStatus = options.cancelStatus || false;
    this.activeId = options.activeId || null;
    this.onDelete = options.onDelete || null;
    this._ticking = false;
    this.selectedRow = null;
    this.selectedColumns = new Map();
    this.selectedCells = new Set();
    this._isDragging = false;
    this._dragStart = null;
    this._dragEnd = null;
    this._hoveredRowIndex = null;
    this._shiftStartCell = null;
    this._contextMenu = null;
    this._copyCells = null;
    this.$fillHandle = null;
    this._isFillDragging = false;
    this._fillStartRange = null;
    this._fillCurrent = null;
    this._fillTarget = null;
    this._numFmt = formatter.number.format;
    this._dateFmt = formatter.date.format;
    this._datetimeFmt = formatter.datetime.format;
    this._lastScrollTop = 0;
    this._data = data;

    this._initPlaceholder();
    this._initFillHandler();
    this._bindEvents();

    this.setupContextMenu();
    this.render();
  }

  _bindEvents() {
    this._bindScrollEvent();
    this._bindClickEvents();
    this._bindKeyboardEvents();
    this._bindFillHandlerEvents();
  }

  /**
   * 데이터 교체(필터 후 등) 시 호출
   */
  setData(newData, shouldRender = true) {
    this.selectedRow = null;
    this._data = newData;
    this.table.style.height = `${this._data.length * this.rowHeight}px`;
    if (shouldRender) this.render();
  }

  rowDelete() {
    if (!this.selectedRange) return;
    const { start, end } = this.selectedRange;
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);

    // 범위 유효성 검사
    const safeMinRow = Math.max(0, Math.min(minRow, this._data.length - 1));
    const safeMaxRow = Math.max(0, Math.min(maxRow, this._data.length - 1));

    // 행 삭제
    this._data.splice(safeMinRow, safeMaxRow - safeMinRow + 1);

    this.selectedRow = null;
    this.selectedCells.clear();
    this.selectedRange = null;
    this._shiftStartCell = null;
    this.table.style.height = `${this.total * this.rowHeight}px`;
    this.render();
    this.hideContextMenu?.();
    this._clearCellSelection();
  }

  /**
   * 풀 크기 조정 (리사이즈 등) & 메인 렌더 함수 & 행/셀 클릭 처리 (이벤트 위임) & 스크롤링 이벤트
   */
  _initPlaceholder (){
    this.table.style.height = `${this._data.length * this.rowHeight}px`
    this.prevStart = null
    this.prevEnd = null

    // thead 용 colspan 계산
    const colspan = this.table.tHead.rows[0]?.cells.length || this.columns.length

    // CSS 변수
    this.container.style.setProperty('--row-height', `${this.rowHeight}px`)

    // placeholder + pool 초기화
    this.tbody.innerHTML = ''

    // 상단 placeholder
    this.topPH = document.createElement('tr')
    this.topPH.className = 'virtual-placeholder top'
    this.topPH.innerHTML = `<td colspan="${colspan}" style="padding:0; border:0;"></td>`
    this.tbody.appendChild(this.topPH)

    // 풀 크기
    this.viewportH = this.container.clientHeight
    this.visibleCount = Math.ceil(this.viewportH / this.rowHeight)
    this.poolSize = this.visibleCount + this.overscan * 2
    this.trPool = []

    for (let i = 0; i < this.poolSize; i++) {
      const tr = document.createElement('tr')

      for (let c = 0; c < this.columns.length; c++) {
        tr.appendChild(document.createElement('td'))
      }

      tr.addEventListener('mouseenter', () => {
        const rowIdx = parseInt(tr.dataset.rowIndex, 10);
        if (!isNaN(rowIdx)) this._hoveredRowIndex = rowIdx;
      });

      this.tbody.appendChild(tr)
      this.trPool.push(tr)
    }

    // 하단 placeholder
    this.botPH = document.createElement('tr')
    this.botPH.className = 'virtual-placeholder bottom'
    this.botPH.innerHTML = `<td colspan="${colspan}" style="padding:0; border:0;"></td>`
    this.tbody.appendChild(this.botPH)
  }

  render () {
    const scrollTop = this.container.scrollTop
    const newStart = Math.max(0, Math.floor(scrollTop / this.rowHeight) - this.overscan)
    const newEnd   = Math.min(this._data.length, newStart + this.trPool.length)

    const poolLength = this.trPool.length

    for (let i = 0; i < poolLength; i++) {
      this._updateRow(i, newStart + i)
    }

    this.prevStart = newStart
    this.prevEnd = newEnd

    // placeholder
    const topPad = newStart * this.rowHeight
    const botPad = (this._data.length - newEnd) * this.rowHeight

    this.container.style.setProperty('--top-placeholder', `${topPad}px`)
    this.container.style.setProperty('--bottom-placeholder', `${botPad}px`)

    this.topPH.firstElementChild .style.height = `${topPad}px`
    this.botPH.firstElementChild .style.height = `${botPad}px`


    this.topPH.style.display = topPad ? '' : 'none'
    this.botPH.style.display = botPad ? '' : 'none'
  }

  _updateRow(poolIndex, rowIdx) {
    const tr = this.trPool[poolIndex];

    if (rowIdx < 0 || rowIdx >= this._data.length) {
      tr.style.display = 'none';
      return;
    }
    const rowData = this._data[rowIdx];

    // 렌더링 수행
    tr.style.display = '';
    tr.dataset.rowIndex = rowIdx;
    tr.className = '';

    const isActive = this.selectedRow === rowIdx || (this.activeId && rowData?.id == this.activeId);
    tr.classList.toggle('active', !!isActive);

    if (this.cancelStatus && rowData?.status == this.cancelStatus) {
      tr.classList.add('canceled');
    }

    const colLength = this.columns.length;
    for (let c = 0; c < colLength; c++) {
      const td = tr.children[c];

      // 여기선 무조건 갱신 (column에 대한 캐싱까지 하려면 별도 구조 필요)
      td.className = '';
      td.innerHTML = '';
      this._cellRenderer(td, rowIdx, c, this.columns[c], rowData);
    }
  }

  _cellRenderer(td, rowIdx, colIdx, col, rowData) {
    td.dataset.cellKey = `${rowIdx}-${colIdx}`;

    const colKey = col.key;
    const colType = col.type ?? 'string';
    const colClass = typeof col === 'string' ? [] : (col.class ?? []);
    const raw = rowData?.[colKey];
    const value = raw ?? '';

    this._highlightDragCellsSingle(rowIdx, colIdx, td);

    td.classList.add(...colClass);
    if (colClass.length === 0 && colType === 'number') {
      td.classList.add('text-right');
    }

    const renderHtmlStringSafely = (htmlStr) => {
      td.innerHTML = '';
      const range = document.createRange();
      const fragment = range.createContextualFragment(htmlStr);
      td.appendChild(fragment);
    };

    const typeHandlers = {
      number: () => {
        const numeric = typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;
        if (numeric === 0) td.classList.add('empty');
        td.textContent = this._numFmt(numeric);
      },
      custom: () => {
        const html = col.html?.(td, rowIdx, colIdx, col, rowData);
        if (html) td.appendChild(html);
      },
      html: () => {
        if (typeof value === 'string') renderHtmlStringSafely(value);
      },
      img: () => {
        if (typeof value === 'string') renderHtmlStringSafely(value);
      },
      date: () => {
        const date = new Date(value);
        td.textContent = isNaN(date.getTime()) ? 'Invalid Date' : this._dateFmt(date);
      },
      datetime: () => {
        const date = new Date(value)
        td.textContent = isNaN(date.getTime()) ? 'Invalid Date' : this._datetimeFmt(date);
      },
      string: () => {
        td.textContent = colKey === 'idx' ? String(rowIdx + 1) : String(value);
      }
    };

    const renderFn = typeHandlers[colType] || typeHandlers['string'];
    renderFn();
  }

  _onClick(evt) {
    evt.preventDefault();
    if (evt.shiftKey || this._isDragging || this._isFillDragging) return; // ← 드래그 중엔 무시

    const td = evt.target.closest('td');
    const tr = evt.target.closest('tr');
    if (!tr || tr.classList.contains('virtual-placeholder')) return;
    if (!td || td.classList.contains('no-selecte')) return;

    const rowIdx = parseInt(tr.dataset.rowIndex, 10);
    if (isNaN(rowIdx)) return;

    const colIdx = td.cellIndex;
    const rowData = this._data[rowIdx];
    const isSame = this.selectedRow === rowIdx;

    const key = `${rowIdx}-${colIdx}`;
    this.selectedCells.clear();
    this.selectedCells.add(key);
    this.selectedRange = {
      start: { row: rowIdx, col: colIdx },
      end: { row: rowIdx, col: colIdx },
    };
    this._shiftStartCell = { row: rowIdx, col: colIdx };

    this.selectedRow = isSame ? null : rowIdx;
    this.render();

    this.table.dispatchEvent(new CustomEvent('onRowClick', {
      detail: { rowIndex: rowIdx, rowData, isSame },
      bubbles: true,
      composed: true,
    }));

    const colKey = this.columns[colIdx];
    this.table.dispatchEvent(new CustomEvent('onCellClick', {
      detail: {
        rowIndex: rowIdx,
        colIndex: colIdx,
        colKey,
        rowData,
        cellText: td.textContent.trim(),
      },
      bubbles: true,
      composed: true,
    }));
  }

  _onClickOutside (e) {
    const path = e.composedPath ? e.composedPath() : e.path || []
    const isInside =
      path.includes(this.container) || // 스크롤 container
      path.includes(this.tbody) || // table 자체
      path.includes(this.$contextMenu) // 메뉴 클릭은 예외

    if (!isInside) {
      this._clearCellSelection();
      this.hideContextMenu();
      this.$fillHandle.remove()
    }
  }

  _onScroll(){
    this._ticking = true;

    requestAnimationFrame(() => {
      this.render();
      this._ticking = false;
      this._lastScrollTop = this.container.scrollTop;
    });
  }

  _bindClickEvents() {
    this._onClick = this._onClick.bind(this);
    this._onClickOutside = this._onClickOutside.bind(this);

    this.table.addEventListener('click', this._onClick);
    window.addEventListener('click', this._onClickOutside, true);
    this._onMouseDown = this._onMouseDown.bind(this);
    this.table.addEventListener('mousedown', this._onMouseDown);
  }

  _bindScrollEvent() {
    this._onScroll = this._onScroll.bind(this);
    this.container.addEventListener('scroll', this._onScroll, { passive: true });
  }

  _unbindScrollEvents() {
    this.container.removeEventListener('scroll', this._onScroll);
  }

  _unbindClickEvents() {
    this.table.removeEventListener('click', this._onClick);
    this.table.removeEventListener('mousedown', this._onMouseDown);
    window.removeEventListener('click', this._onClickOutside, true);
  }

  /**
   * 다중 셀 선택 & 키보드 이벤트
   */
  _onMouseDown(evt) {
    if (this._isFillDragging) return;
    const th = evt.target.closest('th');
    const td = evt.target.closest('td');
    const tr = evt.target.closest('tr');

    const rowIdx = tr ? parseInt(tr.dataset.rowIndex, 10) : NaN;
    const colIdx = td?.cellIndex ?? -1;

    const state = {
      th,
      td,
      tr,
      rowIdx,
      colIdx,
      isTh: !!th,
      hasThId: !!th?.id,
      isTd: !!td,
      isSelectable: td && !td.classList.contains('no-selecte'),
      isShift: evt.shiftKey,
      hasShiftStart: !!this._shiftStartCell,
      hasSelection: this.selectedCells.size > 0
    };

    const handlers = [
      // 1. 선택 불가능한 셀 (td 없음 or no-selecte)
      {
        match: () => !state.isTd || !state.tr || !state.isSelectable,
        action: () => { /* 무시 */ }
      },

      // 2. shift + 기존 시작점 → 범위 확장
      {
        match: () => state.isShift && state.hasShiftStart,
        action: () => {
          const { row: r1, col: c1 } = this._shiftStartCell;
          const r2 = rowIdx;
          const c2 = colIdx;
          this._isDragging = true;
          this._dragStart = { row: r1, col: c1 };
          this._dragEnd = { row: r2, col: c2 };
          this._highlightDragCells(r1, c1, r2, c2);
        }
      },

      // 3. 아무 것도 없던 상태에서 클릭 → drag 시작
      {
        match: () => !state.hasSelection,
        action: () => {
          evt.preventDefault();
          this._isDragging = true;
          this._dragStart = { row: rowIdx, col: colIdx };
          this._shiftStartCell = { row: rowIdx, col: colIdx };
          this._highlightDragCells(rowIdx, colIdx, rowIdx, colIdx);
        }
      },

      // 4. 기존 selection은 있지만 shift도 아님 → drag 재시작
      {
        match: () => state.hasSelection && !state.isShift,
        action: () => {
          evt.preventDefault();
          this._clearCellSelection();
          this._isDragging = true;
          this._dragStart = { row: rowIdx, col: colIdx };
          this._shiftStartCell = { row: rowIdx, col: colIdx };
          this._highlightDragCells(rowIdx, colIdx, rowIdx, colIdx);
        }
      },
    ];

    for (const handler of handlers) {
      if (handler.match()) {
        handler.action();
        break;
      }
    }
  }

  _onMouseMove(evt) {
    if (!this._isDragging || this._isFillDragging) return;

    const td = evt.target.closest('td');
    const tr = evt.target.closest('tr');
    if (!td || !tr) return;

    const endRow = parseInt(tr.dataset.rowIndex, 10);
    const endCol = td.cellIndex;
    if (isNaN(endRow) || isNaN(endCol)) return;

    this._dragEnd = { row: endRow, col: endCol };

    const { row: r1, col: c1 } = this._dragStart;
    const { row: r2, col: c2 } = this._dragEnd;

    this._highlightDragCells(r1, c1, r2, c2);
  }

  _onMouseup(evt) {
    if (!this._isDragging) return;

    this._isDragging = false;
    this._dragStart = null;
    this._dragEnd = null;

    if (this.selectedCells.size > 1) {
      const selectedArray = Array.from(this.selectedCells).map(key => {
        const [row, col] = key.split('-').map(Number);
        return { row, col };
      });

      this.table.dispatchEvent(new CustomEvent('onCellDrag', {
        detail: { selectedCells: selectedArray },
        bubbles: true,
        composed: true,
      }));
    }

    this.showContextMenu();
  }

  _highlightDragCells(r1, c1, r2, c2) {
    this.selectedCells.clear();

    const minRow = Math.min(r1, r2);
    const maxRow = Math.max(r1, r2);
    const minCol = Math.min(c1, c2);
    const maxCol = Math.max(c1, c2);

    this.selectedRange = {
      start: { row: r1, col: c1 },
      end: { row: r2, col: c2 }
    };

    // 선택된 셀 키 등록
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        this.selectedCells.add(`${row}-${col}`);
      }
    }

    // 모든 td에 대해 _highlightDragCellsSingle 적용
    for (const tr of this.trPool) {
      const rowIdx = parseInt(tr.dataset.rowIndex, 10);
      if (isNaN(rowIdx)) continue;

      const tds = tr.children;
      for (let colIdx = 0; colIdx < tds.length; colIdx++) {
        const td = tds[colIdx];
        this._highlightDragCellsSingle(rowIdx, colIdx, td);
      }
    }
  }

  _highlightDragCellsSingle(rowIdx, colIdx, td) {
    const key = `${rowIdx}-${colIdx}`;
    const isSelected = this.selectedCells.has(key);
    const isStart = this.selectedRange &&
      key === `${this.selectedRange.start.row}-${this.selectedRange.start.col}`;

    const targetClasses = new Set();
    if (isSelected) {
      if (isStart) targetClasses.add('start-cell');
      else targetClasses.add('active');

      if (this.selectedRange) {
        const { start, end } = this.selectedRange;
        const minRow = Math.min(start.row, end.row);
        const maxRow = Math.max(start.row, end.row);
        const minCol = Math.min(start.col, end.col);
        const maxCol = Math.max(start.col, end.col);

        if (rowIdx === minRow) targetClasses.add('active-top');
        if (rowIdx === maxRow) targetClasses.add('active-bottom');
        if (colIdx === minCol) targetClasses.add('active-left');
        if (colIdx === maxCol) targetClasses.add('active-right');
      }
    }

    // 현재 클래스 집합
    const currentClasses = td.classList;

    // 관련 클래스만 diff
    const highlightClassSet = [
      'active', 'start-cell',
      'active-top', 'active-bottom',
      'active-left', 'active-right'
    ];

    for (const cls of highlightClassSet) {
      const shouldHave = targetClasses.has(cls);
      const has = currentClasses.contains(cls);

      if (shouldHave && !has) currentClasses.add(cls);
      else if (!shouldHave && has) currentClasses.remove(cls);
    }

    this._updateFillHandlerPosition()
  }

  _clearCellSelection () {
    this.selectedCells.clear();
    this.selectedRange = null

    for (const tr of this.trPool) {
      const tds = tr.children;
      for (let td of tds) {
        td.classList.remove('active');
        td.classList.remove('active-bottom');
        td.classList.remove('active-top');
        td.classList.remove('active-left');
        td.classList.remove('active-right');
      }
    }
  }

  _onKeydown(evt) {
    const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const isMac = navigator.platform.toUpperCase().includes('MAC');

    const isCopyKey =
      (evt.key === 'c' || evt.key === 'C') &&
      ((isMac && evt.metaKey) || (!isMac && evt.ctrlKey));
    const isPasteKey =
      (evt.key === 'v' || evt.key === 'V') &&
      ((isMac && evt.metaKey) || (!isMac && evt.ctrlKey));

    if (isCopyKey) {
      this.cellCopy();
      evt.preventDefault();
      return;
    }

    if (isPasteKey) {
      this._handlePaste(evt);
      evt.preventDefault();
      return;
    }

    if (evt.key === 'Escape' || evt.code === 'Escape') {
      this._handleEscape();
      return;
    }

    if (!ARROW_KEYS.includes(evt.key)) return;
    if (!this.selectedRange || this.selectedCells.size === 0) return;

    this._handleArrowKey(evt);
  }

  _handleArrowKey(evt){
    const { row, col } = this.selectedRange.end || this.selectedRange.start;
    let nextRow = row;
    let nextCol = col;

    const lookupMap = {
      ArrowUp: () => nextRow--,
      ArrowDown: () => nextRow++,
      ArrowLeft: () => nextCol--,
      ArrowRight: () => nextCol++,
    };

    lookupMap[evt.key]?.();

    if (nextRow < 0 || nextRow >= this._data.length) return;
    if (nextCol < 0 || nextCol >= this.columns.length) return;

    // Y축 스크롤 보정
    const scrollTop = this.container.scrollTop;
    const viewportHeight = this.container.clientHeight - this.rowHeight;
    const rowTop = nextRow * this.rowHeight;
    const rowBottom = rowTop + this.rowHeight;

    if (rowTop < scrollTop) {
      this.container.scrollTo({
        top: rowTop,
        behavior: 'auto',
      });
    } else if (rowBottom >= scrollTop + viewportHeight) {
      this.container.scrollTo({
        top: rowBottom - viewportHeight,
        behavior: 'auto',
      });
    }

    // X축 스크롤 보정
    const viewportWidth = this.container.clientWidth;

    const cellSelector = `td[data-cell-key="${nextRow}-${nextCol}"]`;
    const $nextCell = this.container.querySelector(cellSelector);
    if ($nextCell) {
      const cellRect = $nextCell.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();

      const offsetLeft = cellRect.left - containerRect.left;
      const offsetRight = cellRect.right - containerRect.left;

      if (offsetLeft < 0) {
        this.container.scrollBy({ left: offsetLeft, behavior: 'auto' });
      } else if (offsetRight > viewportWidth) {
        this.container.scrollBy({ left: offsetRight - viewportWidth, behavior: 'auto' });
      }
    }

    if (evt.shiftKey && this.selectedCells.size > 0) {
      // 시작점이 없다면 현재 selectedRange.start 사용
      if (!this._shiftStartCell) {
        this._shiftStartCell = { ...this.selectedRange.start };
      }

      // 새로 이동한 셀을 포함한 범위 선택
      this._highlightDragCells(
        this._shiftStartCell.row,
        this._shiftStartCell.col,
        nextRow,
        nextCol
      );

      this.selectedRange = {
        start: { ...this._shiftStartCell },
        end: { row: nextRow, col: nextCol },
      };
    } else {
      // shift 없이 이동한 경우 (단일 이동)
      this.selectedCells.clear();
      this.selectedRange = {
        start: { row: nextRow, col: nextCol },
        end: { row: nextRow, col: nextCol },
      };
      this._shiftStartCell = { row: nextRow, col: nextCol };
      this.selectedCells.add(`${nextRow}-${nextCol}`);
    }

    // 렌더링된 셀에 스타일 반영
    for (const tr of this.trPool) {
      const rowIdx = parseInt(tr.dataset.rowIndex, 10);
      if (isNaN(rowIdx)) continue;

      const tds = tr.children;
      for (let colIdx = 0; colIdx < tds.length; colIdx++) {
        const td = tds[colIdx];
        this._highlightDragCellsSingle(rowIdx, colIdx, td);
      }
    }

    evt.preventDefault();
  }

  _handlePaste(evt) {
    const pasteData = this._copyCells;
    if (!pasteData || !pasteData.html?.length) return;

    const target = this.selectedRange?.start;
    if (!target) return;

    this._pasteIntoCell(target.row, target.col, pasteData);
    this._flashSelectedCells();
  }

  _bindKeyboardEvents() {
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseup = this._onMouseup.bind(this);
    this._onKeydown = this._onKeydown.bind(this);

    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mouseup', this._onMouseup);
    window.addEventListener('keydown', this._onKeydown);
  }

  _unbindKeyboardEvents() {
    window.removeEventListener('keydown', this._onKeydown);
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mouseup', this._onMouseup);
  }

  /**
   * ContextMenu
  */
  setupContextMenu() {
    // 기존 메뉴 제거
    if (this.$contextMenu && this.$contextMenu.parentElement) this.$contextMenu.remove();

    const $menu = document.createElement('div');
    $menu.className = 'context-menu';

    const deleteBtn = `
      <button class="menu-item delete">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14H5V6m3-3h8a2 2 0 0 1 2 2v1H6V5a2 2 0 0 1 2-2z" />
        </svg>
        행 삭제
      </button>
    `;

    const copyBtn = `
      <button class="menu-item copy">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        셀 복사
      </button>
    `;

    const copyWithThBtn = `
      <button class="menu-item copyTh">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        제목과 함께 복사
      </button>
    `;

    const exportExcelBtn = `
      <button class="menu-item export-excel">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        셀 Excel 다운로드
      </button>
    `;

    const exportCSVBtn = `
      <button class="menu-item export-excel-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        전체 Excel 다운로드
      </button>
    `;

    $menu.innerHTML = deleteBtn + copyBtn + copyWithThBtn + exportExcelBtn + exportCSVBtn;
    this.gridDataTable.appendChild($menu);
    this.$contextMenu = $menu;

    const actionMap = {
      delete: () => this.rowDelete?.(),
      copy: () => this.cellCopy?.(),
      copyTh: () => this.cellCopyWithTh?.(),
      'export-excel': () => this._exportExcel?.(),
      'export-excel-all': () => this._exportAllExcel?.(),
    };

    $menu.addEventListener('click', (e) => {
      const $btn = e.target.closest('button');
      if (!$btn) return;

      const type = Array.from($btn.classList).find(cls => actionMap[cls]);
      if (type) actionMap[type]();
    });
  }

  showContextMenu() {
    if (!this.$contextMenu) return;
    if (!this.selectedCells || this.selectedCells.size === 0) {
      this.hideContextMenu();
      return;
    }

    this.$contextMenu.classList.add('show');
  }

  hideContextMenu() {
    if (this.$contextMenu) {
      this.$contextMenu.classList.remove('show');
    }
  }

  _exportExcel() {
    if (!this.selectedCells || this.selectedCells.size === 0) return;

    const { header, body, columns } = this._getSelectedTableData({ full: false });

    this.table.dispatchEvent(new CustomEvent('exportSelected', {
      detail: {
        header,
        body,
        columns,
      },
      bubbles: true,
      composed: true,
    }));
  }

  _exportAllExcel() {
    const { header, body, columns } = this._getSelectedTableData({ full: true });

    this.table.dispatchEvent(new CustomEvent('exportAll', {
      detail: { header, body, columns },
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * cell Selector
  */
  cellCopy() {
    if (!this.selectedCells || this.selectedCells.size === 0) return;

    const { body } = this._getSelectedTableData(); // 텍스트 데이터
    const htmlMatrix = this._getSelectedCellHTML(); // HTML 데이터

    const text = body.map(row => row.join('\t')).join('\n');

    // 클립보드 복사
    navigator.clipboard.writeText(text);

    // 내부 복사 캐시 저장
    this._copyCells = {
      body,
      html: htmlMatrix,
    };
    this._flashSelectedCells();
  }

  _pasteIntoCell(rowStart, colStart, copyData) {
    const fillHTML = copyData.html;
    const fillText = copyData.body;

    const rowLen = fillHTML.length;
    const colLen = fillHTML[0]?.length || 0;

    const rowEnd = Math.min(this._data.length - 1, rowStart + rowLen - 1);
    const colEnd = Math.min(this.columns.length - 1, colStart + colLen - 1);

    for (let i = 0; i < rowLen; i++) {
      const targetRow = rowStart + i;
      if (targetRow > rowEnd) break;

      const rowData = this._data[targetRow];
      if (!rowData) continue;

      for (let j = 0; j < colLen; j++) {
        const targetCol = colStart + j;
        if (targetCol > colEnd) break;

        const col = this.columns[targetCol];
        if (!col || col.class?.includes('no-selecte')) continue;

        const key = col.key;
        const type = col.type || 'string';

        if (type === 'html' || type === 'img') {
          rowData[key] = fillHTML[i]?.[j] ?? '';
        } else {
          rowData[key] = fillText[i]?.[j] ?? '';
        }
      }
      this._flashSelectedCells();
    }

    // 선택 영역 갱신
    this._shiftStartCell = { row: rowStart, col: colStart };
    this.selectedRange = {
      start: { row: rowStart, col: colStart },
      end: { row: rowEnd, col: colEnd },
    };
    this._highlightDragCells(rowStart, colStart, rowEnd, colEnd);
    this.render();
  }

  cellCopyWithTh() {
    if (!this.selectedCells || this.selectedCells.size === 0) return;

    const { header, body } = this._getSelectedTableData();
    const text = [header.join('\t'), ...body.map(row => row.join('\t'))].join('\n');

    navigator.clipboard.writeText(text);
    this._flashSelectedCells();
  }
  // 테이블 데이터 추출
  _getSelectedTableData({ full = false } = {}) {
    const formatterMap = {
      number: (val) => {
        const num = Number(val);
        return isNaN(num) ? '' : new Intl.NumberFormat('en-US').format(Math.round(num));
      },
      date: (val) => {
        const d = new Date(val);
        return isNaN(d.getTime()) ? String(val) : d.toISOString().slice(0, 10);
      },
      string: (val) => val == null ? '' : String(val),
      html: (val) => {
        if (typeof val !== 'string') return '';
        const template = document.createElement('template');
        template.innerHTML = val;
        return template.content.textContent?.trim() ?? '';
      },
      img: (val) => {
        if (typeof val !== 'string') return '';
        const template = document.createElement('template');
        template.innerHTML = val;
        const img = template.content.querySelector('img');
        return img?.src || '';
      },
    };

    const columns = this.columns;
    const headerRow = this.table.tHead?.rows[0];
    const header = columns.map((col, idx) => {
      return headerRow?.cells?.[idx]?.textContent?.trim() || '';
    });

    const isSelecting = !full && this.selectedRange && this.selectedCells.size > 0;
    const rowsToInclude = isSelecting
      ? {
          rowStart: Math.min(this.selectedRange.start.row, this.selectedRange.end.row),
          rowEnd: Math.max(this.selectedRange.start.row, this.selectedRange.end.row),
          colStart: Math.min(this.selectedRange.start.col, this.selectedRange.end.col),
          colEnd: Math.max(this.selectedRange.start.col, this.selectedRange.end.col),
        }
      : {
          rowStart: 0,
          rowEnd: this._data.length - 1,
          colStart: 0,
          colEnd: columns.length - 1,
        };

    const selectableCols = [];
    for (let c = rowsToInclude.colStart; c <= rowsToInclude.colEnd; c++) {
      const col = columns[c];
      if (col && !col.class?.includes('no-selecte')) {
        selectableCols.push(c);
      }
    }

    const body = [];
    for (let r = rowsToInclude.rowStart; r <= rowsToInclude.rowEnd; r++) {
      const rowData = this._data[r];
      if (!rowData) continue;

      const row = [];
      for (const c of selectableCols) {
        const col = columns[c];
        if (!col) continue;

        const type = col.type || 'string';
        const formatter = formatterMap[type] || formatterMap.string;
        const raw = rowData?.[col.key] ?? '';
        row.push(formatter(raw));
      }

      body.push(row);
    }

    return { header: selectableCols.map(i => header[i]), body, columns };
  }
  // 테이블 Dom 추출
  _getSelectedCellHTML() {
    const { start, end } = this.selectedRange ?? {};
    if (!start || !end) return [];

    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);

    const htmlMatrix = [];

    for (let row = minRow; row <= maxRow; row++) {
      const htmlRow = [];
      for (let col = minCol; col <= maxCol; col++) {
        const cellKey = `${row}-${col}`;
        const $td = this.container.querySelector(`td[data-cell-key="${cellKey}"]`);

        if ($td) {
          const $cloned = $td.cloneNode(true);
          const $fill = $cloned.querySelector('.fill-handler');
          if ($fill) $fill.remove();

          htmlRow.push($cloned.innerHTML.trim());
        } else {
          htmlRow.push('');
        }
      }
      htmlMatrix.push(htmlRow);
    }

    return htmlMatrix;
  }

  /**
   * Fill Handler
  */
  _initFillHandler(){
    this.$fillHandle = document.createElement('div');
    this.$fillHandle.className = 'fill-handler';
    this._updateFillHandlerPosition();
  }

  _updateFillHandlerPosition() {
    if (!this.selectedRange || !this.$fillHandle) return;

    const { start, end } = this.selectedRange;

    const isRightward = end.col > start.col;
    const isDownward = end.row > start.row;

    const anchorRow = isDownward ? end.row : start.row;
    const anchorCol = isRightward ? end.col : start.col;

    const rowTr = this.trPool.find(tr => Number(tr.dataset.rowIndex) === anchorRow);
    if (!rowTr) return;

    const targetTd = rowTr.children[anchorCol];
    if (!targetTd) return;

    this.$fillHandle.remove();
    targetTd.appendChild(this.$fillHandle);
    this.$fillHandle.style.display = 'block';
  }

  _calculateFillArea() {
    if (!this._fillStartRange || !this._fillCurrent) return null;

    const { start, end } = this._fillStartRange;
    const baseRowStart = Math.min(start.row, end.row);
    const baseRowEnd = Math.max(start.row, end.row);
    const baseColStart = Math.min(start.col, end.col);
    const baseColEnd = Math.max(start.col, end.col);

    const targetRow = this._fillCurrent.row;
    const targetCol = this._fillCurrent.col;

    let rowStart = baseRowStart;
    let rowEnd = baseRowEnd;
    let colStart = baseColStart;
    let colEnd = baseColEnd;

    // 아래로 드래그 → 선택 영역 아래에 preview 표시
    if (targetRow > baseRowEnd) {
      rowStart = baseRowEnd + 1;
      rowEnd = targetRow;
    }
    // 위로 드래그 → 선택 영역 위에 preview 표시
    else if (targetRow < baseRowStart) {
      rowEnd = baseRowStart - 1;
      rowStart = targetRow;
    }

    // 오른쪽으로 드래그 → 선택 영역 오른쪽에 preview 표시
    if (targetCol > baseColEnd) {
      colStart = baseColEnd + 1;
      colEnd = targetCol;
    }
    // 왼쪽으로 드래그 → 선택 영역 왼쪽에 preview 표시
    else if (targetCol < baseColStart) {
      colEnd = baseColStart - 1;
      colStart = targetCol;
    }

    // 대각선 드래그 or 변화 없음 → 무시
    const isRowValid = rowEnd >= rowStart;
    const isColValid = colEnd >= colStart;
    if (!isRowValid && !isColValid) return null;

    return {
      rows: { start: rowStart, end: rowEnd },
      cols: { start: colStart, end: colEnd },
    };
  }

  _previewFillArea(rowRange, colRange) {
    const { start: rowStart, end: rowEnd } = rowRange;
    const { start: colStart, end: colEnd } = colRange;

    for (const tr of this.trPool) {
      const rowIdx = parseInt(tr.dataset.rowIndex, 10);
      if (isNaN(rowIdx) || rowIdx < rowStart || rowIdx > rowEnd) continue;

      for (let col = colStart; col <= colEnd; col++) {
        const td = tr.children[col];
        if (!td) continue;

        const classList = td.classList;
        classList.add('fill-preview');

        const neighbors = {
          top: `${rowIdx - 1}-${col}`,
          bottom: `${rowIdx + 1}-${col}`,
          left: `${rowIdx}-${col - 1}`,
          right: `${rowIdx}-${col + 1}`,
        };

        const lookupMap = {
          top: () => rowIdx === rowStart && !this.selectedCells.has(neighbors.top),
          bottom: () => rowIdx === rowEnd && !this.selectedCells.has(neighbors.bottom),
          left: () => col === colStart && !this.selectedCells.has(neighbors.left),
          right: () => col === colEnd && !this.selectedCells.has(neighbors.right),
        };

        for (const [dir, shouldApply] of Object.entries(lookupMap)) {
          if (shouldApply()) {
            classList.add(`fill-preview-${dir}`);
          }
        }
      }
    }
  }

  _updateFillPreview() {
    if (!this._fillStartRange || !this._fillCurrent) return;

    const fillArea = this._calculateFillArea(); // 내부에서 this._fillStartRange와 this._fillCurrent 사용

    if (!fillArea) return;
    this._clearFillPreview();
    this._previewFillArea(fillArea.rows, fillArea.cols);
    this._fillTarget = fillArea;
  }

  _applyFill() {
    const source = this._fillStartRange;
    const target = this._fillTarget;
    if (!source || !target) return;

    const fillHTML = this._getSelectedCellHTML(); // DOM 기반
    const { body } = this._getSelectedTableData(); // 실제 데이터 기반

    const { start: rowStart, end: rowEnd } = target.rows;
    const { start: colStart, end: colEnd } = target.cols;

    const rowLen = fillHTML.length;
    const colLen = fillHTML[0]?.length || 0;

    // 실제 데이터 채우기
    for (let i = rowStart; i <= rowEnd; i++) {
      for (let j = colStart; j <= colEnd; j++) {
        const rowOffset = (i - rowStart) % rowLen;
        const colOffset = (j - colStart) % colLen;

        const rowData = this._data[i];
        if (!rowData) continue;

        const col = this.columns[j];
        if (!col || col.class?.includes('no-selecte')) continue;

        const key = col.key;
        const type = col.type || 'string';

        if (type === 'html' || type === 'img') {
          rowData[key] = fillHTML[rowOffset]?.[colOffset] ?? '';
        } else {
          rowData[key] = body[rowOffset]?.[colOffset] ?? '';
        }
      }
    }

    // 선택 영역을 target 범위로 다시 설정
    const oldRange = this.selectedRange;
    const newRange = {
      start: {
        row: Math.min(oldRange.start.row, rowStart),
        col: Math.min(oldRange.start.col, colStart),
      },
      end: {
        row: Math.max(oldRange.end.row, rowEnd),
        col: Math.max(oldRange.end.col, colEnd),
      },
    };
    this.selectedRange = newRange;
    this._shiftStartCell = { ...newRange.start };

    for (let i = rowStart; i <= rowEnd; i++) {
      for (let j = colStart; j <= colEnd; j++) {
        this.selectedCells.add(`${i}-${j}`);
      }
    }

    // 렌더 및 강조 재적용
    this._clearFillPreview();
    this.trPool.forEach((tr) => (tr.dataset.rowIndex = '-1'));
    this.render();
    this._flashSelectedCells();
  }

  _clearFillPreview() {
    const previewClasses = [
      'fill-preview',
      'fill-preview-top',
      'fill-preview-bottom',
      'fill-preview-left',
      'fill-preview-right',
    ];

    for (const tr of this.trPool) {
      for (const td of tr.children) {
        for (const cls of previewClasses) {
          td.classList.remove(cls);
        }
      }
    }
    this.$fillHandle.remove()
  }

  _flashSelectedCells() {
    for (const key of this.selectedCells) {
      const $td = this.container.querySelector(`td[data-cell-key="${key}"]`);
      if (!$td) continue;

      $td.classList.remove('copy-flash'); // 재적용 위해 제거 후 강제 리플로우
      void $td.offsetWidth;
      $td.classList.add('copy-flash');
    }
  }

  _onMouseDownHandler(e) {
    e.preventDefault();
    this._isFillDragging = true;

    if (!this.selectedRange) return;

    const { start, end } = this.selectedRange;
    this._fillStartRange = {
      start: { ...start },
      end: { ...end },
    };

    document.body.style.userSelect = 'none';
  }

  _onMoveHandler(e) {
    if (!this._isFillDragging) return;

    const target = e.target.closest('td');
    if (!target) return;

    const tr = target.closest('tr');
    const rowIdx = parseInt(tr?.dataset.rowIndex ?? '-1', 10);
    const colIdx = target.cellIndex;
    if (rowIdx < 0 || colIdx < 0) return;

    const { start, end } = this._fillStartRange;

    const rowStart = Math.min(start.row, end.row);
    const rowEnd   = Math.max(start.row, end.row);
    const colStart = Math.min(start.col, end.col);
    const colEnd   = Math.max(start.col, end.col);

    const isRowDrag = colIdx >= colStart && colIdx <= colEnd && rowIdx !== rowEnd;
    const isColDrag = rowIdx >= rowStart && rowIdx <= rowEnd && colIdx !== colEnd;

    if (!isRowDrag && !isColDrag) {
      this._fillCurrent = null;
      this._fillTarget = null
      this._clearFillPreview();
      return;
    }

    let next = null;

    if (isRowDrag) {
      next = { row: rowIdx, col: colStart }; // Y축 이동 (열은 동일)
    } else if (isColDrag) {
      next = { row: rowStart, col: colIdx }; // X축 이동 (행은 동일)
    }

    const nextKey = `${next?.row}-${next?.col}`;
    if (
      (this._fillCurrent?.row === next?.row &&
      this._fillCurrent?.col === next?.col) ||
      this.selectedCells.has(nextKey)
    ) {
      return;
    }

    this._fillCurrent = next;
    this._updateFillPreview();
  }

  _onMouseupHandler() {
    if (!this._isFillDragging) return;
    this._applyFill();

    this._isFillDragging = false;
    this._fillStartRange = null;
    document.body.style.userSelect = '';
  }

  _bindFillHandlerEvents() {
    this._onMouseDownHandler = this._onMouseDownHandler.bind(this);
    this._onMoveHandler = this._onMoveHandler.bind(this);
    this._onMouseupHandler = this._onMouseupHandler.bind(this);

    this.$fillHandle.addEventListener('mousedown', this._onMouseDownHandler);
    this.container.addEventListener('mousemove', this._onMoveHandler);
    window.addEventListener('mouseup', this._onMouseupHandler);
  }

  _unbindFillHandlerEvents() {
    if (this.$fillHandle) {
      this.$fillHandle.removeEventListener('mousedown', this._onMouseDownHandler);
    }
    this.container.removeEventListener('mousemove', this._onMoveHandler);
    window.removeEventListener('mouseup', this._onMouseupHandler);
  }

  // ------------------------------------------
  destroy() {
    this._unbindScrollEvents();
    this._unbindClickEvents();
    this._unbindKeyboardEvents();
    this._unbindFillHandlerEvents();
    this._clearInternalState();
  }

  _clearInternalState() {
    this.trPool = [];
    this.selectedCells.clear();
    this.selectedColumns.clear();
    this.tbody.innerHTML = '';
  }
}