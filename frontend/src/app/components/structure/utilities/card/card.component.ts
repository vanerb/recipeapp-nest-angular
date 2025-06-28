import { Component, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../../../../interfaces/recipes';
import { EditModalComponent } from '../../pages/main-management/edit-modal/edit-modal.component';
import { ModalService } from '../../../../services/modal.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  @Input() data: Recipe | null = null
  @Input() editMode: boolean = false
  @Output() action: EventEmitter | null = null

  constructor(private readonly router: Router, private readonly modalService: ModalService) {

  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/no-image.jpg';
  }

  async viewDetails(item: Recipe | null) {
    if (item !== null)
       this.action?.emit("details")
     // this.router.navigate(['/recipe/' + item.id]);

  }

  edit(id: string | undefined) {
    this.modalService.open(EditModalComponent, {
      width: '90%',
      height: '90%'
    },
      { id: id });
  }

  delete(item: Recipe | null) {
    this.modalService.open(DeleteModalComponent, {
      width: '450px',
    },
      { title: "Eliminar", message: "¿Está seguro de que quiere eliminar el elemento " + item?.title + "?" }).then(() => {
        this.action?.emit("delete")
      })
      .catch(() => {
        console.log('✘ Cancelado');
        this.modalService.close()
      });;
  }
}
