import formatter from './formatter.js'

/**
 * start, end 두 Date 사이의 nights, days, hours, minutes 계산
 * - nights: 이용시간 -> 박단위 ( 호텔 박수 개념 )
 * - days: 이용시간 -> 일단위
 * - hours: 이용시간 -> 시간단위
 * - minutes: 이용시간 -> 분단위
 * @param {Date} start
 * @param {Date} end
 * @returns {{ nights: number, days: number, hours: number, minutes: number }}
 */
export function getDuration (s, e) {

  const start = s instanceof Date ? s : new Date(s)
  const end   = e instanceof Date ? e : new Date(e)

  const MS = {
    MINUTE: 1000 * 60,
    HOUR  : 1000 * 60 * 60,
    DAY   : 1000 * 60 * 60 * 24
  }

  const diffMs = end.getTime() - start.getTime()

  if (diffMs <= 0) {
    return { nights: 0, days: 0, hours: 0, minutes: 0 }
  }

  // 1) 날짜 차이 계산 (자정 기준)
  const sMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const eMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  const dayDiff   = Math.floor((eMidnight - sMidnight) / MS.DAY)

  const nights = dayDiff
  const days   = dayDiff + 1

  // 2) 전체 시간(소수점 포함)
  const totalHoursDecimal = diffMs / MS.HOUR

  // 3) 전체 분
  const totalMinutes = Math.floor(diffMs / MS.MINUTE)

  // 4) “xx시간 yy분” 포맷팅
  const intHours = Math.floor(totalHoursDecimal)
  const remMinutes = Math.round((totalHoursDecimal - intHours) * 60)

  // 5) 남은 시간(하루 단위로 나눈 나머지)
  const remainMs = diffMs % MS.DAY
  const minutes  = Math.floor((remainMs) / MS.MINUTE)

  return {
    start,
    end,
    nights,
    days,
    hours     : totalHoursDecimal,
    minutes   : totalMinutes,
    remMinutes: minutes,
    intHours,
    remMinutes
  }

}

export function getSearchDates (startDate, period) {

  const start_datetime = new Date(startDate)
  start_datetime.setHours(0, 0, 0, 0)

  const end_datetime = new Date(start_datetime)
  end_datetime.setDate(start_datetime.getDate() + Number(period))
  end_datetime.setHours(23, 59, 59, 59)

  return {
    start_datetime: formatter.datetime.format(start_datetime),
    end_datetime  : formatter.datetime.format(end_datetime)
  }

}