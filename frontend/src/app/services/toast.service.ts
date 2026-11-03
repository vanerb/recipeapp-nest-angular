import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private timer?: ReturnType<typeof setTimeout>;
  readonly toast$ = new BehaviorSubject<Toast | null>(null);

  show(message: string, type: Toast['type'] = 'success') {
    clearTimeout(this.timer);
    this.toast$.next({ message, type });
    this.timer = setTimeout(() => this.toast$.next(null), 4500);
  }

  error(message: string) {
    this.show(message, 'error');
  }
}
