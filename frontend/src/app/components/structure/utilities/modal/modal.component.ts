import { Component, ComponentRef, Type, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @ViewChild('modalContent', { read: ViewContainerRef, static: false })
  modalContent!: ViewContainerRef;

  show = false;
  styles: { [key: string]: string } = {};
  private componentRef?: ComponentRef<any>;

  open<T>(component: Type<T>, styles: { [key: string]: string } = {}) {
    this.styles = styles;
    this.show = true;

    // Esperar a que el contenido esté en el DOM
    setTimeout(() => {
      if (!this.modalContent) {
        console.error('modalContent no está inicializado todavía.');
        return;
      }

      this.modalContent.clear();
      this.componentRef = this.modalContent.createComponent(component);
    });

  }

  close() {
    this.modalContent.clear();
    this.show = false;
  }
}
