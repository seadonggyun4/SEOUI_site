import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportExcel = ({ header, body, columns }) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Sheet1');
  // 1. 헤더 삽입
  sheet.addRow(header);

  // 2. 컬럼별 최대 길이 계산
  const colMaxLens = header.map((h, i) => {
    let max = h?.length || 0;
    for (let r = 0; r < body.length; r++) {
      const cellText = body[r][i] ?? '';
      max = Math.max(max, String(cellText).length);
    }
    return max;
  });

  // 3. 컬럼 width 설정
  sheet.columns = colMaxLens.map(len => ({
    width: Math.min(Math.max(len * 1.2, 10), 60),
  }));

  // 4. 대량 삽입 처리
  const BATCH_SIZE = 1000;
  let current = 0;

  const processBatch = () => {
    const end = Math.min(current + BATCH_SIZE, body.length);
    for (let i = current; i < end; i++) {
      sheet.addRow(body[i]);
    }

    current = end;

    if (current < body.length) {
      setTimeout(processBatch, 0);
    } else {
      _applySheetStyle(sheet, columns);
      _downloadWorkbook(workbook);
    }
  };

  processBatch();
}

const _applySheetStyle = (sheet, columns) => {
  sheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      const colMeta = columns[colNumber - 1];
      const classes = colMeta?.class ?? [];

      const alignMap = {
        'text-left': 'left',
        'text-center': 'center',
        'text-right': 'right',
      };
      const alignment = classes.find(c => alignMap[c]) || 'text-left';

      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      cell.alignment = {
        vertical: 'middle',
        horizontal: alignMap[alignment],
      };

      if (rowNumber === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEFEFEF' },
        };
        cell.font = { bold: true };
      }
    });
  });
}

const _downloadWorkbook = (workbook) => {
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const now = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    saveAs(blob, `export_${now}.xlsx`);
  });
}

export const exportCsv = ({ header, body }) => {
  // 셀 값 이스케이프
  const escapeCsvCell = (val) => {
    if (val == null) return '';
    const str = String(val);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // CSV 문자열 생성
  const csvRows = [];

  // 헤더
  csvRows.push(header.map(escapeCsvCell).join(','));

  // 바디
  for (const row of body) {
    csvRows.push(row.map(escapeCsvCell).join(','));
  }

  // BOM 추가 + Blob 생성
  const bom = '\uFEFF'; // UTF-8 BOM
  const csvContent = bom + csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const now = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  saveAs(blob, `export_${now}.csv`);
}