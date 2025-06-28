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

  open<T>(component: Type<T>, styles: { [key: string]: string } = {}, data: Partial<T> = {}) {
    this.styles = styles;
    this.show = true;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.modalContent) return;

        this.modalContent.clear();
        this.componentRef = this.modalContent.createComponent(component);

        // Inyectar datos
        Object.assign(this.componentRef.instance, data);

        // Inyectar funciones especiales al componente cargado
        (this.componentRef.instance as any).close = () => {
          this.close();
          reject(); // o resolve(false)
        };

        (this.componentRef.instance as any).confirm = (result?: any) => {
          this.close();
          resolve(result); // puede ser undefined, true, o datos
        };
      });
    });
  }

  close() {
    this.modalContent.clear();
    this.show = false;
  }
}
