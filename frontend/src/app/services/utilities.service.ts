import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() {
  }

  sleep(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  transformDate(isoDate: string) {
    const date = new Date(isoDate);
    const formatted = date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC", // o tu zona horaria local
    });

    return formatted
  }
}
