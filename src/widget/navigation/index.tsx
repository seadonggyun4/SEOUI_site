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
        <h2>
          <img src='/logo.png' />
        </h2>
      </div>

      <nav class={{ 'nav-list': true }}>
        {currentLinks.map((group) => (
          <div class="nav-group" key={group.title}>
            <div class="nav-group-title">
              {group.title}
            </div>
            <ul class="nav-group-list">
              {group.children.map((item) => (
                <li key={item.href} class="nav-item">
                  <Link
                    href={item.href}
                    class={`nav-link ${loc.url.pathname === item.href ? 'active' : ''}`}
                  >
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
    title: 'DatePicker',
    children: [
      { label: '달력', href: '/components-page/ag-datepicker/' },
    ],
  },
  {
    title: 'Toast Message',
    children: [
      { label: '알림 메시지', href: '/components-page/ag-toast/' },
    ],
  },
  {
    title: 'Search Selete',
    children: [
      { label: '셀렉트 박스', href: '/components-page/ag-select/' },
      { label: '검색 셀렉트 박스', href: '/components-page/ag-select-search/' },
    ],
  },
  {
    title: 'Grid Table',
    children: [
      { label: '그리드 테이블', href: '/components-page/ag-grid-table/' },
    ],
  },
];