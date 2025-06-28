import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css'
})
export class DeleteModalComponent {
  @Input() title: string = ""
  @Input() message: string = ""
  confirm!: (result?: any) => void;
  close!: () => void;

}
