export interface TopBarMenuItem {
  label: string;
  icon: string;
  link: string;
}

export const TopBarMenu: TopBarMenuItem[] = [
  {
    label: 'Select',
    icon: 'fas fa-chevron-down',
    link: '/document/select/select-usecase',
  },
  {
    label: 'Toast',
    icon: 'fas fa-bell',
    link: '/document/toast/toast-usecase',
  },
  {
    label: 'CheckBox',
    icon: 'fas fa-check-square',
    link: '/document/check-box/check-box-usecase',
  },
  {
    label: 'Grid Table',
    icon: 'fas fa-table',
    link: '/document/grid-table/grid-table-usecase',
  },
  {
    label: 'Date Picker',
    icon: 'fas fa-calendar-alt',
    link: '/document/date-picker/date-picker-usecase',
  },
];

export const FirstPage = TopBarMenu[0].link

export const selectMenu = [
  {
    title: 'UseCase',
    children: [
      { label: '셀렉트 박스', href: '/document/select/select-usecase/' },
      { label: '검색 셀렉트 박스', href: '/document/select/select-search-usecase/' },
    ],
  },
]
export const ToastMenu = [
  {
    title: 'UseCase',
    children: [
      { label: '알림 메시지', href: '/document/toast/toast-usecase/' },
    ],
  },
]
export const CheckBoxMenu = [
  {
    title: 'UseCase',
    children: [
      { label: '체크박스', href: '/document/check-box/check-box-usecase/' },
    ],
  },
]
export const GridTableMenu = [
  {
    title: 'UseCase',
    children: [
      { label: '그리드 테이블', href: '/document/grid-table/grid-table-usecase/' },
    ],
  },
]
export const DatePickerMenu = [
  {
    title: 'UseCase',
    children: [
      { label: '달력', href: '/document/date-picker/date-picker-usecase/' },
    ],
  },
]

