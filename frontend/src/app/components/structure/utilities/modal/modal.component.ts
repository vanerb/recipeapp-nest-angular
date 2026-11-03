import {
  Component,
  ComponentRef,
  ElementRef,
  HostListener,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @ViewChild('modalContent', { read: ViewContainerRef })
  modalContent?: ViewContainerRef;
  @ViewChild('dialog') dialog?: ElementRef<HTMLElement>;

  show = false;
  private componentRef?: ComponentRef<any>;
  private resolver?: (result?: unknown) => void;
  private previousFocus: HTMLElement | null = null;

  open<T>(component: Type<T>, data: Partial<T> = {}): Promise<any> {
    this.previousFocus = document.activeElement as HTMLElement | null;
    this.show = true;

    return new Promise((resolve) => {
      this.resolver = resolve;
      // Espera a que el *ngIf cree el contenedor
      setTimeout(() => {
        this.modalContent!.clear();
        this.componentRef = this.modalContent!.createComponent(component);
        Object.assign(this.componentRef.instance as object, data);

        const instance = this.componentRef.instance as any;
        instance.close = () => this.finish();
        instance.confirm = (result?: unknown) => this.finish(result);
        this.dialog?.nativeElement.focus();
      });
    });
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.show) {
      this.finish();
    }
  }

  finish(result?: unknown) {
    this.modalContent?.clear();
    this.show = false;
    this.resolver?.(result);
    this.resolver = undefined;
    this.previousFocus?.focus();
  }
}
