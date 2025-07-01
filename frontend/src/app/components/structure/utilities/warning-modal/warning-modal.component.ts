import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-warning-modal',
  templateUrl: './warning-modal.component.html',
  styleUrl: './warning-modal.component.css'
})
export class WarningModalComponent {
  @Input() title: string = ""
  @Input() message: string = ""
  confirm!: (result?: any) => void;
  close!: () => void;
}
