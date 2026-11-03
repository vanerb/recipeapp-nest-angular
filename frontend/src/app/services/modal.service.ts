import { Injectable, Type } from '@angular/core';
import { ModalComponent } from '../components/structure/utilities/modal/modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalRef?: ModalComponent;

  register(modal: ModalComponent) {
    this.modalRef = modal;
  }

  // Resuelve con el resultado de confirm(), o undefined si se cierra sin confirmar
  open<T>(component: Type<T>, data: Partial<T> = {}): Promise<any> {
    return this.modalRef!.open(component, data);
  }
}
