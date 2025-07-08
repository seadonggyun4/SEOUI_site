declare module 'utils/date.js' {
  export interface Duration {
    nights: number;
    days: number;
    hours: number;
    minutes: number;
    intHours: number,
    remMinutes: number;
  }

  export function getDuration(s: Date, e: Date): Duration;
}