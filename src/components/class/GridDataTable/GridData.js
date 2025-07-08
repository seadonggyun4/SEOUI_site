/**
 * 개선된 GridData 클래스
 * - 불변성 보장
 * - 타입 안전성 강화
 * - 성능 최적화
 * - 에러 핸들링 개선
 * - 메서드 체이닝 지원
 */
export class GridData {
  constructor() {
    this._data = [];
    this._originalData = null;
    this._filteredData = null;
    this._isFiltered = false;
  }

  // 초기 데이터 설정 (불변성 보장)
  initialize = (data) => {
    if (!Array.isArray(data)) {
      console.warn('GridData.initialize: data는 배열이어야 합니다.');
      data = [];
    }

    // 깊은 복사로 불변성 보장
    this._data = data.length > 0 ? this._deepClone(data) : [];
    this._originalData = data.length > 0 ? this._deepClone(data) : null;
    this._filteredData = null;
    this._isFiltered = false;

    return this; // 메서드 체이닝 지원
  }

  // 데이터 설정 (필터 상태 유지)
  setData = (newData) => {
    if (!Array.isArray(newData)) {
      console.warn('GridData.setData: newData는 배열이어야 합니다.');
      newData = [];
    }

    this._data = newData.length > 0 ? this._deepClone(newData) : [];

    // 필터된 상태였다면 필터 해제
    if (this._isFiltered) {
      this._filteredData = null;
      this._isFiltered = false;
    }

    return this;
  }

  // 원본 데이터로 리셋
  resetData = () => {
    if (!this._originalData) {
      console.warn('GridData.resetData: 원본 데이터가 없습니다.');
      return this;
    }

    this._data = this._deepClone(this._originalData);
    this._filteredData = null;
    this._isFiltered = false;

    return this;
  }

  // 개선된 필터링 (다양한 검색 옵션 지원)
  filterData = (searchKeys, columns, options = {}) => {
    if (!this._originalData?.length) {
      console.warn('GridData.filterData: 필터링할 데이터가 없습니다.');
      return [];
    }

    if (!Array.isArray(searchKeys) || !Array.isArray(columns)) {
      console.warn('GridData.filterData: searchKeys와 columns는 배열이어야 합니다.');
      return this._originalData;
    }

    const {
      caseSensitive = false,
      exactMatch = false,
      operator = 'OR' // 'OR' | 'AND'
    } = options;

    const normalizeValue = (value) => {
      if (value == null) return '';
      const str = String(value);
      return caseSensitive ? str : str.toLowerCase();
    };

    const normalizedSearchKeys = searchKeys.map(normalizeValue);

    const filtered = this._originalData.filter(row => {
      const matches = columns.map(colKey => {
        const cellValue = normalizeValue(row[colKey]);

        return normalizedSearchKeys.some(searchKey => {
          if (exactMatch) {
            return cellValue === searchKey;
          }
          return cellValue.includes(searchKey);
        });
      });

      return operator === 'AND' ? matches.every(Boolean) : matches.some(Boolean);
    });

    this._filteredData = filtered;
    this._isFiltered = true;

    return filtered;
  }

  // 고급 필터링 (함수 기반)
  filterByPredicate = (predicate) => {
    if (!this._originalData?.length) {
      console.warn('GridData.filterByPredicate: 필터링할 데이터가 없습니다.');
      return [];
    }

    if (typeof predicate !== 'function') {
      console.warn('GridData.filterByPredicate: predicate는 함수여야 합니다.');
      return this._originalData;
    }

    try {
      const filtered = this._originalData.filter(predicate);
      this._filteredData = filtered;
      this._isFiltered = true;
      return filtered;
    } catch (error) {
      console.error('GridData.filterByPredicate: 필터링 중 오류 발생:', error);
      return this._originalData;
    }
  }

  // 개선된 행 삭제 (인덱스 범위와 행 ID 모두 지원)
  deleteRows = (target) => {
    if (!this._data?.length) {
      return { deleted: [], data: this._data };
    }

    let deletedRows = [];
    let indicesToDelete = [];

    // 삭제 대상 결정
    const targetHandlers = {
      // 선택 범위로 삭제
      range: () => target.minRow !== undefined && target.maxRow !== undefined,
      // 행 인덱스 배열로 삭제
      indices: () => Array.isArray(target),
      // 행 ID 배열로 삭제
      ids: () => target.ids && Array.isArray(target.ids),
      // 조건 함수로 삭제
      predicate: () => typeof target === 'function'
    };

    if (targetHandlers.range()) {
      const { minRow, maxRow } = target;
      const safeMinRow = Math.max(0, Math.min(minRow, this._data.length - 1));
      const safeMaxRow = Math.max(0, Math.min(maxRow, this._data.length - 1));

      for (let i = safeMinRow; i <= safeMaxRow; i++) {
        indicesToDelete.push(i);
      }
    } else if (targetHandlers.indices()) {
      indicesToDelete = target.filter(idx =>
        Number.isInteger(idx) && idx >= 0 && idx < this._data.length
      );
    } else if (targetHandlers.ids()) {
      const idsToDelete = new Set(target.ids);
      this._data.forEach((row, index) => {
        if (row.id && idsToDelete.has(row.id)) {
          indicesToDelete.push(index);
        }
      });
    } else if (targetHandlers.predicate()) {
      try {
        this._data.forEach((row, index) => {
          if (target(row, index)) {
            indicesToDelete.push(index);
          }
        });
      } catch (error) {
        console.error('GridData.deleteRows: predicate 실행 중 오류:', error);
        return { deleted: [], data: this._data };
      }
    } else {
      console.warn('GridData.deleteRows: 올바르지 않은 삭제 대상입니다.');
      return { deleted: [], data: this._data };
    }

    // 중복 제거 및 내림차순 정렬 (뒤에서부터 삭제)
    const uniqueIndices = [...new Set(indicesToDelete)].sort((a, b) => b - a);

    // 삭제 실행
    for (const index of uniqueIndices) {
      const deletedRow = this._data.splice(index, 1)[0];
      if (deletedRow) {
        deletedRows.unshift(deletedRow); // 원래 순서 유지
      }
    }

    // 필터 상태 업데이트
    if (this._isFiltered && this._filteredData) {
      // 필터된 데이터에서도 동일한 행들을 제거
      const deletedIds = new Set(deletedRows.map(row => row.id).filter(Boolean));
      this._filteredData = this._filteredData.filter(row =>
        !deletedIds.has(row.id)
      );
    }

    return { deleted: deletedRows, data: this._data };
  }

  // 행 추가
  addRows = (newRows, position = 'end') => {
    if (!Array.isArray(newRows)) {
      console.warn('GridData.addRows: newRows는 배열이어야 합니다.');
      return this;
    }

    const clonedRows = this._deepClone(newRows);

    const positionHandlers = {
      start: () => this._data.unshift(...clonedRows),
      end: () => this._data.push(...clonedRows),
      number: () => {
        const index = Math.max(0, Math.min(position, this._data.length));
        this._data.splice(index, 0, ...clonedRows);
      }
    };

    if (typeof position === 'number') {
      positionHandlers.number();
    } else {
      const handler = positionHandlers[position] || positionHandlers.end;
      handler();
    }

    return this;
  }

  // 행 업데이트
  updateRow = (index, updatedData) => {
    if (!Number.isInteger(index) || index < 0 || index >= this._data.length) {
      console.warn('GridData.updateRow: 올바르지 않은 인덱스입니다.');
      return this;
    }

    if (typeof updatedData !== 'object' || updatedData === null) {
      console.warn('GridData.updateRow: updatedData는 객체여야 합니다.');
      return this;
    }

    // 기존 데이터와 병합
    this._data[index] = { ...this._data[index], ...updatedData };

    return this;
  }

  // 정렬
  sortData = (sortKey, direction = 'asc', customComparator = null) => {
    if (!this._data?.length) return this;

    const comparator = customComparator || this._defaultComparator;

    this._data.sort((a, b) => {
      const result = comparator(a[sortKey], b[sortKey]);
      return direction === 'desc' ? -result : result;
    });

    return this;
  }

  // 검색 (정규식 지원)
  searchData = (searchTerm, columns, useRegex = false) => {
    if (!this._originalData?.length) return [];

    if (!searchTerm) return this._originalData;

    let matcher;

    if (useRegex) {
      try {
        matcher = new RegExp(searchTerm, 'i');
      } catch (error) {
        console.warn('GridData.searchData: 올바르지 않은 정규식입니다.');
        matcher = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      }
    } else {
      const normalizedTerm = String(searchTerm).toLowerCase();
      matcher = { test: (value) => String(value).toLowerCase().includes(normalizedTerm) };
    }

    return this._originalData.filter(row =>
      columns.some(colKey => matcher.test(row[colKey] || ''))
    );
  }

  // 통계 정보
  getStats = () => {
    return {
      total: this._data.length,
      originalTotal: this._originalData?.length || 0,
      filteredTotal: this._filteredData?.length || 0,
      isFiltered: this._isFiltered,
      isEmpty: this._data.length === 0,
      hasOriginal: this._originalData !== null
    };
  }

  // 현재 표시 중인 데이터 반환
  getData = () => {
    return this._data;
  }

  // 원본 데이터 반환 (읽기 전용)
  getOriginalData = () => {
    return this._originalData ? this._deepClone(this._originalData) : null;
  }

  // 필터된 데이터 반환
  getFilteredData = () => {
    return this._filteredData ? this._deepClone(this._filteredData) : null;
  }

  // 전체 개수 반환
  getTotal = () => {
    return this._data.length;
  }

  // 특정 행 반환
  getRow = (index) => {
    if (!Number.isInteger(index) || index < 0 || index >= this._data.length) {
      return null;
    }
    return this._deepClone(this._data[index]);
  }

  // 특정 조건의 행들 반환
  findRows = (predicate) => {
    if (typeof predicate !== 'function') {
      console.warn('GridData.findRows: predicate는 함수여야 합니다.');
      return [];
    }

    try {
      return this._data.filter(predicate);
    } catch (error) {
      console.error('GridData.findRows: 검색 중 오류 발생:', error);
      return [];
    }
  }

  // 데이터 유효성 검사
  validateData = (schema) => {
    if (!schema || typeof schema !== 'object') {
      console.warn('GridData.validateData: schema는 객체여야 합니다.');
      return { isValid: true, errors: [] };
    }

    const errors = [];

    this._data.forEach((row, index) => {
      Object.entries(schema).forEach(([field, validator]) => {
        if (typeof validator === 'function') {
          try {
            const isValid = validator(row[field], row, index);
            if (!isValid) {
              errors.push(`Row ${index}, Field ${field}: 유효성 검사 실패`);
            }
          } catch (error) {
            errors.push(`Row ${index}, Field ${field}: ${error.message}`);
          }
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
      totalChecked: this._data.length
    };
  }

  // 데이터 내보내기 (다양한 형식 지원)
  exportData = (format = 'json', options = {}) => {
    const { includeHeaders = true, delimiter = ',' } = options;

    const exportHandlers = {
      json: () => JSON.stringify(this._data, null, 2),
      csv: () => this._toCsv(this._data, includeHeaders, delimiter),
      tsv: () => this._toCsv(this._data, includeHeaders, '\t'),
      array: () => this._deepClone(this._data)
    };

    const handler = exportHandlers[format] || exportHandlers.json;
    return handler();
  }

  // 유틸리티 메서드들
  _deepClone = (obj) => {
    // 최신 브라우저에서 지원하는 structuredClone 사용 (가장 안전)
    if (typeof structuredClone === 'function') {
      try {
        return structuredClone(obj);
      } catch (error) {
        // structuredClone이 실패하면 fallback 사용
        console.warn('structuredClone 실패, 대안 방법 사용:', error);
      }
    }

    // Fallback: 수동 깊은 복사
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (Array.isArray(obj)) return obj.map(item => this._deepClone(item));

    // 일반 객체 - Object.keys() 사용 (안전함)
    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = this._deepClone(obj[key]);
    });

    return cloned;
  }

  _defaultComparator = (a, b) => {
    if (a === b) return 0;
    if (a == null) return 1;
    if (b == null) return -1;

    const aNum = Number(a);
    const bNum = Number(b);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }

    return String(a).localeCompare(String(b));
  }

  _toCsv = (data, includeHeaders, delimiter) => {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const escapeValue = (value) => {
      const str = String(value || '');
      if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = data.map(row =>
      headers.map(header => escapeValue(row[header])).join(delimiter)
    );

    if (includeHeaders) {
      rows.unshift(headers.map(escapeValue).join(delimiter));
    }

    return rows.join('\n');
  }

  // 메모리 정리
  destroy = () => {
    this._data = [];
    this._originalData = null;
    this._filteredData = null;
    this._isFiltered = false;
  }
}