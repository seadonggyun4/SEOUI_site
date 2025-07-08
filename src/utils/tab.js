export function initTabControl (tabSelector = 'ag-tab[data-tab]', contentSelector = '[data-tab-content]') {
  const $tabs = document.querySelectorAll(tabSelector)
  const $tables = document.querySelectorAll(contentSelector)

  if ($tabs.length === 0 || $tables.length === 0) return

  $tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab')

      $tabs.forEach(t => t.removeAttribute('active'))
      tab.setAttribute('active', '')

      $tables.forEach(table => {
        const tabContent = table.getAttribute('data-tab-content')
        table.classList.toggle('is-active', tabContent === target)
      })
    })
  })
}
