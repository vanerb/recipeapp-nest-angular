import { Pipe, PipeTransform } from '@angular/core';

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
];
const formatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform {
  transform(date: string): string {
    const seconds = (new Date(date).getTime() - Date.now()) / 1000;
    for (const [unit, size] of UNITS) {
      if (Math.abs(seconds) >= size) {
        return formatter.format(Math.round(seconds / size), unit);
      }
    }
    return 'ahora mismo';
  }
}
