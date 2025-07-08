// CRC32 계산 유틸
function computeCRC32(bytes) {
  const table = new Uint32Array(256).map((_, i) => {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    return c >>> 0;
  });

  let crc = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ bytes[i]) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// CustomZipBuilder 클래스
class CustomZipBuilder {
  constructor() {
    this.localHeaders = [];
    this.centralDirectories = [];
    this.fileData = [];
    this.offset = 0;
    this.encoder = new TextEncoder();
  }

  addFile(filename, content) {
    const filenameBytes = this.encoder.encode(filename);
    const contentBytes = this.encoder.encode(content);
    const crc32 = computeCRC32(contentBytes);
    const size = contentBytes.length;

    // Local File Header
    const localHeader = new Uint8Array(30 + filenameBytes.length);
    const view = new DataView(localHeader.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint32(14, crc32, true);
    view.setUint32(18, size, true);
    view.setUint32(22, size, true);
    view.setUint16(26, filenameBytes.length, true);
    view.setUint16(28, 0, true);
    localHeader.set(filenameBytes, 30);

    // Central Directory
    const centralDir = new Uint8Array(46 + filenameBytes.length);
    const cdView = new DataView(centralDir.buffer);
    cdView.setUint32(0, 0x02014b50, true);
    cdView.setUint16(4, 20, true);
    cdView.setUint16(6, 20, true);
    cdView.setUint16(8, 0, true);
    cdView.setUint16(10, 0, true);
    cdView.setUint16(12, 0, true);
    cdView.setUint16(14, 0, true);
    cdView.setUint32(16, crc32, true);
    cdView.setUint32(20, size, true);
    cdView.setUint32(24, size, true);
    cdView.setUint16(28, filenameBytes.length, true);
    cdView.setUint16(30, 0, true);
    cdView.setUint16(32, 0, true);
    cdView.setUint16(34, 0, true);
    cdView.setUint16(36, 0, true);
    cdView.setUint32(38, 0, true);
    cdView.setUint32(42, this.offset, true);
    centralDir.set(filenameBytes, 46);

    // 누적
    this.localHeaders.push(localHeader);
    this.fileData.push(contentBytes);
    this.centralDirectories.push(centralDir);
    this.offset += localHeader.length + contentBytes.length;
  }

  getBlob() {
    const cdSize = this.centralDirectories.reduce((sum, cd) => sum + cd.length, 0);
    const cdOffset = this.offset;

    // EOCD
    const eocd = new Uint8Array(22);
    const eocdView = new DataView(eocd.buffer);
    eocdView.setUint32(0, 0x06054b50, true);
    eocdView.setUint16(4, 0, true);
    eocdView.setUint16(6, 0, true);
    eocdView.setUint16(8, this.centralDirectories.length, true);
    eocdView.setUint16(10, this.centralDirectories.length, true);
    eocdView.setUint32(12, cdSize, true);
    eocdView.setUint32(16, cdOffset, true);
    eocdView.setUint16(20, 0, true);

    const zipParts = [...this.localHeaders, ...this.fileData, ...this.centralDirectories, eocd];
    return new Blob(zipParts, { type: 'application/zip' });
  }
}

export function createXlsxBlob(selectedCells, columns) {
  // 1. 셀 데이터를 2차원 배열로 변환
  const rowMap = new Map();
  for (const { row, col, value } of selectedCells) {
    if (!rowMap.has(row)) rowMap.set(row, new Map());
    rowMap.get(row).set(col, value);
  }

  const rows = Array.from(rowMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([_, cols]) =>
      Array.from(cols.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([_, val]) => val)
    );

  // 2. Sheet XML 생성
  const sheetData = rows
    .map((cols, r) => {
      const cells = cols.map((val, c) => {
        const colName = String.fromCharCode(65 + c); // A, B, ...
        return `<c r="${colName}${r + 1}" t="inlineStr"><is><t>${val}</t></is></c>`;
      }).join('');
      return `<row r="${r + 1}">${cells}</row>`;
    })
    .join('');

  const sheetXML = `
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
      <sheetData>${sheetData}</sheetData>
    </worksheet>
  `.trim();

  // 3. [Content_Types].xml
  const contentTypes = `
    <?xml version="1.0" encoding="UTF-8"?>
    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
      <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
      <Default Extension="xml" ContentType="application/xml"/>
      <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
      <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
    </Types>
  `.trim();

  // 4. workbook.xml
  const workbookXML = `
    <?xml version="1.0" encoding="UTF-8"?>
    <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
      <sheets>
        <sheet name="Sheet1" sheetId="1" r:id="rId1"/>
      </sheets>
    </workbook>
  `.trim();

  // 5. workbook.rels
  const relsXML = `
    <?xml version="1.0" encoding="UTF-8"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
    </Relationships>
  `.trim();

  // 6. .rels
  const rootRelsXML = `
    <?xml version="1.0" encoding="UTF-8"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
    </Relationships>
  `.trim();

  // 7. Zip으로 포장
  const zip = new CustomZipBuilder();
  zip.addFile('[Content_Types].xml', contentTypes);
  zip.addFile('_rels/.rels', rootRelsXML);
  zip.addFile('xl/workbook.xml', workbookXML);
  zip.addFile('xl/_rels/workbook.xml.rels', relsXML);
  zip.addFile('xl/worksheets/sheet1.xml', sheetXML);

  return zip.getBlob();
}
