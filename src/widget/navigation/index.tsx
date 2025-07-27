import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { useNavigation } from '@/context/NavigationContext';
import { useMenuMatcher } from '@/hooks/useMenuMatcher';
import './style.scss';

export const Navigation = component$(() => {
  const nav = useNavigation();
  const { currentMenu, currentPathname } = useMenuMatcher();

  return (
    <aside class={{ nav: true, open: nav.isOpen }}>
      <div class="nav-header">
        <h2>
          <img src='/logo_header.png' />
        </h2>
      </div>

      <nav class={{ 'nav-list': true }}>
        {currentMenu.value.map((group) => (
          <div class="nav-group" key={group.title}>
            <div class="nav-group-title">
              {group.title}
            </div>
            <ul class="nav-group-list">
              {group.children.map((item) => (
                <li key={item.href} class="nav-item">
                  <Link
                    href={item.href}
                    class={`nav-link ${currentPathname.value === item.href ? 'active' : ''}`}
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