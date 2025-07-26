interface DatePickerElement extends HTMLElement {
  open?: (rect: DOMRect, target: HTMLElement, hasTime?: RegExpMatchArray | null) => void;
  date?: string;
  time?: string;
  criteriaDate?: string;
  minDate?: string;
}

interface OpenDatePickerParams {
  target: HTMLElement | null;
  datepicker: DatePickerElement | null;
  endTargetId?: string;
  startTargetId?: string;
}

export const openDatePicker = ({
  target,
  datepicker,
  endTargetId,
  startTargetId
}: OpenDatePickerParams): void => {
  if (!target || !datepicker) return;

  const rect = target.getBoundingClientRect();
  const value = (target as HTMLInputElement).value || '';

  if (typeof datepicker.open === 'function') {
    datepicker.date = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || '';
    datepicker.time = value.match(/\d{2}:\d{2}$/)?.[0] || '';
    // time picker 분기처리
    datepicker.open(rect, target, value.match(/\d{2}:\d{2}$/));
  }

  if (endTargetId && (target.id === endTargetId || (target as HTMLInputElement).name === endTargetId)) {
    const startInput = (document.getElementById(startTargetId!) as HTMLInputElement) || 
                      document.querySelector<HTMLInputElement>(`[name="${startTargetId}"]`);
    const startValue = startInput?.value ?? '';
    datepicker.criteriaDate = startValue;
    datepicker.minDate = startValue;
  }
};