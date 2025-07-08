import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { useNavigation } from '@/context/NavigationContext';
import './style.scss';

export const Navigation = component$(() => {
  const nav = useNavigation();
  const loc = useLocation();
  const path = loc.url.pathname;

  const tab = path.startsWith('/components-page') ? 'component' : 'design';
  const currentLinks = tab === 'design' ? designLinks : componentLinks;

  return (
    <aside class={{ nav: true, open: nav.isOpen }}>
      <div class="nav-header">
        <h2>angelcar UI</h2>
        <div class="nav-tabs">
          <Link
            href="/angelcar-info-foreigner/info/"
            class={`nav-tab ${tab === 'design' ? 'active' : ''}`}
          >
            디자인 시안
          </Link>
          <Link
            href="/components-page/erp/ag-button"
            class={`nav-tab ${tab === 'component' ? 'active' : ''}`}
          >
            컴포넌트
          </Link>
        </div>
      </div>

      <nav class={{ 'nav-list': true }}>
        {currentLinks.map((group) => (
          <div class="nav-group" key={group.title}>
            <div class="nav-group-title">{group.title}</div>
            <ul class="nav-group-list">
              {group.children.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    class={loc.url.pathname === item.href ? 'active' : ''}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
});

const designLinks = [
    {
    title: '엔젤카 외국인 가이드 앱',
    children: [
      { label: '외국인 가이드 앱', href: '/angelcar-info-foreigner/info/' },
      // { label: '인증', href: '/angelcar-info-foreigner/user/' },
      // { label: '메시지', href: '/angelcar-info-foreigner/message/' },
    ],
  },
];

const componentLinks = [
  {
    title: '엔젤카 ERP',
    children: [
      { label: '버튼', href: '/components-page/erp/ag-button/' },
      { label: '체크박스', href: '/components-page/erp/ag-check-box/' },
      { label: '달력', href: '/components-page/erp/ag-datepicker/' },
      { label: '알림 메시지', href: '/components-page/erp/ag-toast/' },
      { label: '목차', href: '/components-page/erp/ag-bread-crumb/' },
      { label: '탭', href: '/components-page/erp/ag-tab/' },
      { label: '가상 스크롤 셀렉트', href: '/components-page/erp/ag-select/' },
      { label: '검색 셀렉트 박스', href: '/components-page/erp/ag-select-search/' },
      { label: '윈도우 프레임', href: '/components-page/erp/ag-window/' },
      { label: '가상 스크롤 테이블', href: '/components-page/erp/ag-table/' },
    ],
  },
];
