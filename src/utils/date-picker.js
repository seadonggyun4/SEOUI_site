export const openDatePicker = ({
  target,
  datepicker,
  endTargetId,
  startTargetId
}) => {
  if (!target || !datepicker) return

  const rect = target.getBoundingClientRect()
  const value = target.value

  if (typeof datepicker.open === 'function') {
    datepicker.date = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || ''
    datepicker.time = value.match(/\d{2}:\d{2}$/)?.[0] || ''
    // time picker 분기처리
    datepicker.open(rect, target, value.match(/\d{2}:\d{2}$/))
  }

  if (endTargetId && (target.id === endTargetId || target.name === endTargetId)) {
    const startInput = document.getElementById(startTargetId) || document.querySelector(`[name="${startTargetId}"]`)
    const startValue = startInput?.value ?? ''
    datepicker.criteriaDate = startValue
    datepicker.minDate = startValue
  }
}
