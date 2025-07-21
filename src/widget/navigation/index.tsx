import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { useNavigation } from '@/context/NavigationContext';
import './style.scss';

export const Navigation = component$(() => {
  const nav = useNavigation();
  const loc = useLocation();
  const path = loc.url.pathname;

  const tab = path.startsWith('/components-page') ? 'component' : '';
  const currentLinks = tab === 'component' ? componentLinks : [];

  return (
    <aside class={{ nav: true, open: nav.isOpen }}>
      <div class="nav-header">
        <h2>SEOUI</h2>
      </div>

      <nav class={{ 'nav-list': true }}>
        {currentLinks.map((group) => (
          <div class="nav-group" key={group.title}>
            <div class="nav-group-title">
              <i class={`${group.iconClass} nav-group-icon`}></i>
              {group.title}
            </div>
            <ul class="nav-group-list">
              {group.children.map((item) => (
                <li key={item.href} class="nav-item">
                  <Link
                    href={item.href}
                    class={`nav-link ${loc.url.pathname === item.href ? 'active' : ''}`}
                  >
                    <i class={`${item.iconClass} nav-item-icon`}></i>
                    <span class="nav-item-label">{item.label}</span>
                    <span class="nav-item-indicator"></span>
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

const componentLinks = [
  {
    title: 'Elements',
    icon: '⚡',
    children: [
      { label: '버튼', href: '/components-page/ag-button/', icon: '🔘' },
      { label: '체크박스', href: '/components-page/ag-check-box/', icon: '☑️' },
      { label: '달력', href: '/components-page/ag-datepicker/', icon: '📅' },
      { label: '알림 메시지', href: '/components-page/ag-toast/', icon: '💬' },
      { label: '목차', href: '/components-page/ag-bread-crumb/', icon: '🗂️' },
      { label: '탭', href: '/components-page/ag-tab/', icon: '📑' },
    ],
  },
  {
    title: 'VirtualScroll',
    icon: '🔄',
    children: [
      { label: '가상 스크롤 셀렉트', href: '/components-page/ag-select/', icon: '📋' },
      { label: '검색 셀렉트 박스', href: '/components-page/ag-select-search/', icon: '🔍' },
      { label: '윈도우 프레임', href: '/components-page/ag-window/', icon: '🪟' },
      { label: '가상 스크롤 테이블', href: '/components-page/ag-table/', icon: '📊' },
    ],
  },
  {
    title: 'ETC',
    icon: '🛠️',
    children: [
      { label: '윈도우 프레임', href: '/components-page/ag-window/', icon: '🪟' },
    ],
  },
];