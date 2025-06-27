import { Injectable } from '@angular/core';
import { ModalComponent } from '../components/structure/utilities/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

   private modalRef?: ModalComponent;

  register(modal: ModalComponent) {
    this.modalRef = modal;
  }

  open(component: any, styles: { [key: string]: string } = {}) {
    this.modalRef?.open(component, styles);
  }

  close() {
    this.modalRef?.close();
  }
}
