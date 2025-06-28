import { Injectable, Type } from '@angular/core';
import { ModalComponent } from '../components/structure/utilities/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalRef?: ModalComponent;

  register(modal: ModalComponent) {
    this.modalRef = modal;
  }

  open<T>(
    component: Type<T>,
    styles: { [key: string]: string } = {},
    data: Partial<T> = {}
  ): Promise<any> {
    return this.modalRef!.open(component, styles, data);
  }

  close() {
    this.modalRef?.close();
  }
}
