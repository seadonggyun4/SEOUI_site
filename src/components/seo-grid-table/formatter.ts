interface Formatter {
  date: Intl.DateTimeFormat;
  time: Intl.DateTimeFormat;
  datetime: Intl.DateTimeFormat;
  number: Intl.NumberFormat;
  week: (weekday?: 'narrow' | 'short' | 'long') => Intl.DateTimeFormat;
}

interface WeekdayInfo {
  idx: number;
  name: string;
}

interface ViewFormatResult {
  weekname: string;
  datetime: string;
  date: string;
  time: string;
  format: string;
}

const formatter: Formatter = {
  date: new Intl.DateTimeFormat('sv-SE'),
  time: new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit', // 두 자리 시
    minute: '2-digit', // 두 자리 분
    hour12: false // 24시간제 사용
  }),
  datetime: new Intl.DateTimeFormat('sv', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // 24시간 표기
  }),
  number: new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 0, // 최소 0자리
    maximumFractionDigits: 2 // 최대 2자리
  }),
  week: (weekday: 'narrow' | 'short' | 'long' = 'short') => 
    new Intl.DateTimeFormat('ko-KR', { weekday })
};

export const weekdays: WeekdayInfo[] = Array.from({ length: 7 }, (_, i) => {
  return {
    idx: i,
    name: formatter.week().format(new Date(Date.UTC(2021, 0, 3 + i)))
  };
});

export const viewFormat = (datestr: string | Date): ViewFormatResult => {
  const v = new Date(datestr);
  const datetime = formatter.datetime.format(v);
  const date = formatter.date.format(v);
  const time = formatter.time.format(v);
  const weekname = weekdays[v.getDay()]?.name || '';
  const format = `${date} (${weekname}) ${time}`;

  return {
    weekname,
    datetime,
    date,
    time,
    format
  };
};

export default formatter;