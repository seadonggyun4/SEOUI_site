export interface TopBarMenuItem {
  label: string;
  icon: string;
  link: string;
}

export const TopBarMenu: TopBarMenuItem[] = [
  {
    label: 'Select',
    icon: 'fas fa-chevron-down',
    link: '/select/select-usecase',
  },
  {
    label: 'Toast',
    icon: 'fas fa-bell',
    link: '/toast/toast-usecase',
  },
  {
    label: 'CheckBox',
    icon: 'fas fa-check-square',
    link: '/check-box/check-box-usecase',
  },
  {
    label: 'Grid Table',
    icon: 'fas fa-table',
    link: '/grid-table/grid-table-usecase',
  },
  {
    label: 'Date Picker',
    icon: 'fas fa-calendar-alt',
    link: '/date-picker/date-picker-usecase',
  },
];

export const selectMenu = [
  {
    title: 'UseCase',
    children: [
      { label: '셀렉트 박스', href: '/select/select-usecase/' },
      { label: '검색 셀렉트 박스', href: '/select/select-search-usecase/' },
    ],
  },
]
export const ToastMenu = [
  {
    title: 'UseCase',
    children: [
      { label: '알림 메시지', href: '/toast/toast-usecase/' },
    ],
  },
]
export const CheckBoxMenu = [
  {
    title: 'UseCase',
    children: [
      { label: '체크박스', href: '/check-box/check-box-usecase/' },
    ],
  },
]
export const GridTableMenu = [
  {
    title: 'UseCase',
    children: [
      { label: '그리드 테이블', href: '/grid-table/grid-table-usecase/' },
    ],
  },
]
export const DatePickerMenu = [
  {
    title: 'UseCase',
    children: [
      { label: '달력', href: '/date-picker/date-picker-usecase/' },
    ],
  },
]

