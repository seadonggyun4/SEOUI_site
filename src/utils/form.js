export const checkChangeFormData = (form) => {

  const changed = {} // 결과를 담을 객체

  for (const el of form.querySelectorAll('input, select, textarea')) {
    if (!el.name) continue

    // ✅ _delete는 무조건 포함
    if (el.name.endsWith('[_delete]')) {
      changed[el.name] = 1
      continue
    }

    // ✅ new-xxx 로 시작하는 신규 항목은 무조건 포함
    if (/item\[new-\d+\]\[/.test(el.name)) {
      changed[el.name] = el.value
      continue
    }
  }

  // form.elements 는 모든 컨트롤(NodeList)
  for (const el of form.elements) {
    if (!el.name) continue // name 없는 컨트롤은 무시

    let isDirty = false

    switch (el.type) {
    case 'checkbox':
    case 'radio':
      isDirty = el.checked !== el.defaultChecked
      break

    case 'select-one':
      // 단일 select
      isDirty = [...el.options].some(
        opt => opt.selected !== opt.defaultSelected
      )
      break

    case 'select-multiple':
      // 다중 select
      isDirty = [...el.options].some(
        opt => opt.selected !== opt.defaultSelected
      )
      break

    case undefined:
    default: // text, email, number, textarea 등
      isDirty = el.value !== el.defaultValue || el.dataset.changed === '1'
    }

    if (isDirty) {
    // 보내고 싶은 형태대로 가공
      if (el.type === 'checkbox')
        changed[el.name] = el.checked
      else if (el.type.startsWith('select'))
        changed[el.name] =
        el.multiple
          ? [...el.selectedOptions].map(o => o.value)
          : el.value
      else
        changed[el.name] = el.value
    }
  }

  return changed
}

