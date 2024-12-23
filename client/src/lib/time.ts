import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function getTimeInTimezone(timezone: string): Date {
  return dayjs().tz(timezone).toDate();
}

export function formatTime(date: Date): string {
  return dayjs(date).format('HH:mm:ss');
}

export function formatDate(date: Date): string {
  return dayjs(date).format('YYYY-MM-DD');
}

export function getDayName(day: number): string {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
}

export function getShortDayName(day: number): string {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];
}
