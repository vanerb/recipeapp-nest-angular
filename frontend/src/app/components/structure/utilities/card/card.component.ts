import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../../../../interfaces/recipes';
import { EditModalComponent } from '../../pages/main-management/edit-modal/edit-modal.component';
import { ModalService } from '../../../../services/modal.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  @Input() data: any | null = null
  @Input() editMode: boolean = false
  @Output() action = new EventEmitter<{ type: string, item: any | null }>()

  constructor(private readonly router: Router, private readonly modalService: ModalService) {

  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/no-image.jpg';
  }

  async viewDetails(item: any) {
    if (item !== null)
      this.action?.emit({ type: "details", item: item })

  }

  edit(item: any) {
    this.action?.emit({ type: "update", item: item })
  }

  delete(item: any) {
    this.action?.emit({ type: "delete", item: item })
  }
}
