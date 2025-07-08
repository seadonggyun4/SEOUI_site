import { component$, $ } from '@builder.io/qwik'
import { useNavigation } from '@/context/NavigationContext'
import './style.scss'

export const NavToggleButton = component$(() => {
  const nav = useNavigation()

  const toggle = $(() => nav.isOpen = !nav.isOpen)

  return (
    <button class="nav-toggle-btn" onClick$={toggle}>
      <i class="fas fa-bars fa-lg"></i>
    </button>
  )
})
