import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from './components/structure/utilities/modal/modal.component';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  @ViewChild('modal') modal!: ModalComponent;

  constructor(private modalService: ModalService) { }

  ngAfterViewInit() {
    this.modalService.register(this.modal);
  }
}
