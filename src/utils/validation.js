export const validateDatetime = (value) => {
  const cleaned = value.replace(/[^0-9]/g, '').slice(0, 12) // yyyyMMddHHmm
  const parts = cleaned.match(/^(\d{0,4})(\d{0,2})(\d{0,2})(\d{0,2})?(\d{0,2})?/)

  if (!parts) return ''

  const [ , y = '', m = '', d = '', h = '', min = '' ] = parts

  const yy = y
  const MM = m.length === 2 && Number(m) >= 1 && Number(m) <= 12 ? m.padStart(2, '0') : m
  const dd = d.length === 2 && Number(d) >= 1 && Number(d) <= 31 ? d.padStart(2, '0') : d

  let HH = ''
  let mm = ''

  if (h.length > 0) {
    let hour = Number(h)
    let minute = Number(min)

    if (h.length === 2 && min.length === 2) {
      if (hour >= 24 || minute >= 60) {
        HH = '00'
        mm = '00'
      } else {
        // 반올림
        if (minute >= 45) {
          hour += 1
          minute = 0
        } else if (minute >= 15) {
          minute = 30
        } else {
          minute = 0
        }

        HH = String(hour).padStart(2, '0')
        mm = String(minute).padStart(2, '0')
      }
    } else {
      HH = h
      mm = min
    }
  }

  // 조립
  let formatted = yy
  if (m.length > 0) formatted += '-' + MM
  if (d.length > 0) formatted += '-' + dd
  if (h.length > 0) formatted += ` ${HH}`
  if (min.length > 0) formatted += `:${mm}`

  return formatted
}



export const validateDate = (value) => {

  return value
    .replace(/[^0-9]/g, '')
    .slice(0, 8)
    .replace(/(\d{4})(\d{0,2})?(\d{0,2})?/, (_, y, m = '', d = '') => `${y}${m ? '-' + m : ''}${d ? '-' + d : ''}`)
}

export const validatePhoneNumber = (value) => {
  return value
    .replace(/[^0-9]/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d{0,4})?(\d{0,4})?/, (_, y, m = '', d = '') => `${y}${m ? '-' + m : ''}${d ? '-' + d : ''}`)
}