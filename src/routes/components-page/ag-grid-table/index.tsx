import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { docs } from './docs';
import { GridDataTable } from '@/components/class/GridTable/GridTable';
import { exportExcel } from '@/utils/export';
import './style.scss'

const familyNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
const firstNames = [
  '민수', '서연', '지우', '현우', '예은', '도윤', '수빈', '지민', '하늘', '서준',
  '하람', '유진', '다은', '지호', '가은', '재윤', '채원', '윤서', '승현', '시우'
];
const statuses = ['대기중', '완료', '진행중', '실패'];
const statusIcons: Record<string, string> = {
  대기중: '<i class="fas fa-clock"></i>',
  완료: '<i class="fas fa-check-circle"></i>',
  진행중: '<i class="fas fa-spinner"></i>',
  실패: '<i class="fas fa-times-circle"></i>',
};

const statusColors: Record<string, string> = {
  대기중: 'gray',
  완료: 'green',
  진행중: 'blue',
  실패: 'red',
}

const getRandomEmail = (name: string) =>
  `${name.toLowerCase()}@example.com`.replace(/[\s]/g, '');

const getRandomKoreanName = () => {
  const family = familyNames[Math.floor(Math.random() * familyNames.length)];
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  return `${family}${first}`;
}

const columns = [
  { key: 'id', type: 'number', class: ['text-left'] },
  { key: 'name', type: 'string', class: ['text-left'] },
  { key: 'email', type: 'string', class: ['text-left'] },
  { key: 'status', type: 'html', class: ['text-left'] },
  { key: 'amount', type: 'number', class: ['text-left'] },
  { key: 'image', type: 'img', class: ['text-left'] },
  { key: 'date', type: 'date', class: ['text-left'] },
  { key: 'actions', type: 'html', class: ['text-left', 'no-selecte'] },
];

const data = Array.from({ length: 100 }).map((_, i) => {
  const name = getRandomKoreanName();
  const statusText = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    id: i + 1,
    name,
    email: getRandomEmail(name),
    status: `
      <span class="status-badge ${statusColors[statusText]}">
        ${statusIcons[statusText]} <p>${statusText}</p>
      </span>
    `,
    amount: Math.floor(Math.random() * 1_000_000),
    image: `
      <img
        src="https://s.pstatic.net/static/www/mobile/edit/20250630_1095/upload_175126799529715ljK.png"
        alt="${name}"
      />
    `,
    date: new Date(Date.now() - i * 1000 * 3600).toISOString(),
    actions: `
      <button class="icon-button" data-id="${i + 1}">
        삭제
      </button>
    `,
  };
});

const textOnlyColumns = [
  { key: 'id', type: 'number', class: ['text-left'] },
  { key: 'name', type: 'string', class: ['text-left'] },
  { key: 'email', type: 'string', class: ['text-left'] },
  { key: 'department', type: 'string', class: ['text-left'] },
  { key: 'position', type: 'string', class: ['text-left'] },
  { key: 'region', type: 'string', class: ['text-left'] },
  { key: 'status', type: 'string', class: ['text-left'] },
  { key: 'tag', type: 'string', class: ['text-left'] },
  { key: 'phone', type: 'string', class: ['text-left'] },
  { key: 'note', type: 'string', class: ['text-left'] },
  { key: 'project', type: 'string', class: ['text-left'] },
  { key: 'manager', type: 'string', class: ['text-left'] },
  { key: 'createdBy', type: 'string', class: ['text-left'] },
  { key: 'updatedBy', type: 'string', class: ['text-left'] },
  { key: 'accessLevel', type: 'string', class: ['text-left'] },
  { key: 'group', type: 'string', class: ['text-left'] },
  { key: 'location', type: 'string', class: ['text-left'] },
  { key: 'contractType', type: 'string', class: ['text-left'] },
  { key: 'joinDate', type: 'string', class: ['text-left'] },
  { key: 'resignDate', type: 'string', class: ['text-left'] },
  { key: 'extension1', type: 'string', class: ['text-left'] },
  { key: 'extension2', type: 'string', class: ['text-left'] },
  { key: 'extension3', type: 'string', class: ['text-left'] },
  { key: 'extension4', type: 'string', class: ['text-left'] },
  { key: 'extension5', type: 'string', class: ['text-left'] },
  { key: 'extension6', type: 'string', class: ['text-left'] },
  { key: 'extension7', type: 'string', class: ['text-left'] },
  { key: 'extension8', type: 'string', class: ['text-left'] },
  { key: 'extension9', type: 'string', class: ['text-left'] },
  { key: 'extension10', type: 'string', class: ['text-left'] },
];

const departments = ['개발팀', '디자인팀', '기획팀', '영업팀', 'QA팀'];
const positions = ['사원', '주임', '대리', '과장', '차장', '부장'];
const regions = ['서울', '부산', '대구', '광주', '인천'];
const status = ['재직중', '휴직', '퇴사'];
const tags = ['내부', '외부', '협력사', '계약직'];
const contractTypes = ['정규직', '계약직', '프리랜서'];
const managers = ['김부장', '이과장', '박팀장', '최실장', '정수석'];
const groups = ['A조', 'B조', 'C조'];
const accessLevels = ['normal', 'admin', 'manager'];

const randomDate = (start: Date, end: Date) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().slice(0, 10);
};

const dummyTextData = Array.from({ length: 5000 }).map((_, i) => {
  const name = getRandomKoreanName();
  const joinDate = randomDate(new Date(2015, 0, 1), new Date(2023, 0, 1));
  const isResigned = Math.random() < 0.2;
  const resignDate = isResigned ? randomDate(new Date(joinDate), new Date(2024, 11, 31)) : '';

  return {
    id: i + 1,
    name,
    email: getRandomEmail(name),
    department: departments[Math.floor(Math.random() * departments.length)],
    position: positions[Math.floor(Math.random() * positions.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
    status: status[Math.floor(Math.random() * status.length)],
    tag: tags[Math.floor(Math.random() * tags.length)],
    phone: `010-${String(Math.floor(1000 + Math.random() * 9000))}-${String(Math.floor(1000 + Math.random() * 9000))}`,
    note: `${name}은(는) 테스트용 사용자입니다.`,
    project: `Project-${String.fromCharCode(65 + (i % 5))}`,
    manager: managers[Math.floor(Math.random() * managers.length)],
    createdBy: 'system',
    updatedBy: 'admin',
    accessLevel: accessLevels[Math.floor(Math.random() * accessLevels.length)],
    group: groups[Math.floor(Math.random() * groups.length)],
    location: `${regions[Math.floor(Math.random() * regions.length)]} 본사`,
    contractType: contractTypes[Math.floor(Math.random() * contractTypes.length)],
    joinDate,
    resignDate,
    extension1: `필드1-${i}`,
    extension2: `필드2-${i}`,
    extension3: `필드3-${i}`,
    extension4: `필드4-${i}`,
    extension5: `필드5-${i}`,
    extension6: `필드6-${i}`,
    extension7: `필드7-${i}`,
    extension8: `필드8-${i}`,
    extension9: `필드9-${i}`,
    extension10: `필드10-${i}`,
  };
});


export default component$(() => {
  useVisibleTask$(async () => {
    await customElements.whenDefined('ag-grid-table');

    requestAnimationFrame(() => {
      const demoTable = document.querySelector('#demo-table') as HTMLTableElement;
      const demoWrapper = demoTable.closest('.ag-table-scroll') as HTMLElement;
      if(demoTable && demoWrapper){
        demoWrapper.style.height = '50rem';
        demoWrapper.style.overflowY = 'auto';

        new GridDataTable(demoTable, dummyTextData, textOnlyColumns, {
          overscan: 50,
        });

        demoTable.addEventListener('exportSelected', (e) => {
          const { header, body, columns } = (e as CustomEvent<any>).detail;
          exportExcel({ header, body, columns });
        });

        demoTable.addEventListener('exportAll', (e) => {
          const { header, body, columns } = (e as CustomEvent<any>).detail;
          exportExcel({ header, body, columns });
        });
      }

      const gtable = document.querySelector('#gtable') as HTMLTableElement;
      const wrapper = gtable.closest('.ag-table-scroll') as HTMLElement;
      if(gtable && wrapper){
        wrapper.style.height = '60rem';
        wrapper.style.overflowY = 'auto';

        new GridDataTable(gtable, data, columns, {
          rowHeight: 45,
          overscan: 100
        });

        gtable.addEventListener('exportSelected', (e) => {
          const { header, body, columns } = (e as CustomEvent<any>).detail;
          exportExcel({ header, body, columns });
        });

        gtable.addEventListener('exportAll', (e) => {
          const { header, body, columns } = (e as CustomEvent<any>).detail;
          exportExcel({ header, body, columns });
        });
      }
    });
  });

  return (
    <>
      <DocSection {...docs.virtualTable}>
        <ag-grid-table>
          <table id="demo-table">
            <colgroup>
              <col style="width: 6rem;" />
              <col style="width: 10rem;" />
              <col style="width: 16rem;" />
              <col style="width: 10rem;" />
              <col style="width: 8rem;" />
              <col style="width: 8rem;" />
              <col style="width: 8rem;" />
              <col style="width: 6rem;" />
              <col style="width: 12rem;" />
              <col style="width: 16rem;" />
              <col style="width: 12rem;" />
              <col style="width: 10rem;" />
              <col style="width: 10rem;" />
              <col style="width: 10rem;" />
              <col style="width: 10rem;" />
              <col style="width: 8rem;" />
              <col style="width: 10rem;" />
              <col style="width: 10rem;" />
              <col style="width: 10rem;" />
              <col style="width: 10rem;" />
              <col style="width: 12rem;" />
              <col style="width: 12rem;" />
              <col style="width: 12rem;" />
              <col style="width: 12rem;" />
              <col style="width: 12rem;" />
              <col style="width: 12rem;" />
              <col style="width: 12rem;" />
              <col style="width: 12rem;" />
              <col style="width: 12rem;" />
              <col style="width: 12rem;" />
            </colgroup>
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>이메일</th>
                <th>부서</th>
                <th>직책</th>
                <th>지역</th>
                <th>상태</th>
                <th>태그</th>
                <th>연락처</th>
                <th>비고</th>
                <th>프로젝트</th>
                <th>매니저</th>
                <th>생성자</th>
                <th>수정자</th>
                <th>접근권한</th>
                <th>그룹</th>
                <th>근무지</th>
                <th>계약형태</th>
                <th>입사일</th>
                <th>퇴사일</th>
                <th>확장필드1</th>
                <th>확장필드2</th>
                <th>확장필드3</th>
                <th>확장필드4</th>
                <th>확장필드5</th>
                <th>확장필드6</th>
                <th>확장필드7</th>
                <th>확장필드8</th>
                <th>확장필드9</th>
                <th>확장필드10</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </ag-grid-table>
      </DocSection>

      <DocSection {...docs.cellSelection}>
        <ag-grid-table>
          <table id="gtable">
            <colgroup>
              <col width="5%"/>
              <col width="5%"/>
              <col width="20%"/>
              <col width="10%"/>
              <col width="10%"/>
              <col width="15%"/>
              <col width="30%"/>
              <col width="5%"/>
            </colgroup>

            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>이메일</th>
                <th>상태</th>
                <th>금액</th>
                <th>이미지</th>
                <th>날짜</th>
                <th>관리</th>
              </tr>
            </thead>

            <tbody></tbody>
          </table>
        </ag-grid-table>
      </DocSection>

      <DocSection {...docs.fillHandler}>
      </DocSection>

      <DocSection {...docs.deleteAndExport}>
      </DocSection>
    </>
  );
});
