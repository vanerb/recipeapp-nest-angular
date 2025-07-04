import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors} from "@angular/forms";

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

  emptyArray(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // Verificamos que sea un array y tenga al menos un elemento
    if (Array.isArray(value) && value.length === 0) {
      return { arrayVacio: true };
    }

    return null;
  }



}
