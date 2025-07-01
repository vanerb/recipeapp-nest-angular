import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  sleep(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
