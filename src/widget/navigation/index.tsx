import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { useNavigation } from '@/context/NavigationContext';
import { 
  selectMenu, 
  ToastMenu, 
  CheckBoxMenu, 
  GridTableMenu, 
  DatePickerMenu 
} from '@/config/menu';
import './style.scss';

export const Navigation = component$(() => {
  const nav = useNavigation();
  const loc = useLocation();
  
  // 현재 경로의 첫 번째 세그먼트 추출
  const pathSegments = loc.url.pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  
  // 첫 번째 세그먼트에 따라 적절한 메뉴 선택
  const getCurrentMenu = () => {
    switch (firstSegment) {
      case 'select':
        return selectMenu;
      case 'toast':
        return ToastMenu;
      case 'check-box':
        return CheckBoxMenu;
      case 'grid-table':
        return GridTableMenu;
      case 'date-picker':
        return DatePickerMenu;
      default:
        return [
          {
            title: 'Error',
            children: [
              { label: 'label에 오류가 발생했습니다.', href: '#' }
            ]
          }
        ]; // 기본 더미 메뉴
    }
  };
  
  const currentLinks = getCurrentMenu();

  return (
    <aside class={{ nav: true, open: nav.isOpen }}>
      <div class="nav-header">
        <h2>
          <img src='/logo_header.png' />
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