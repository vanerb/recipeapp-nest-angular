import {Component, Input, OnInit} from '@angular/core';
import {Category, UpdateCategory} from "../../../../../interfaces/categories";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../../../../services/categories.service";
import {WarningModalComponent} from "../../../utilities/warning-modal/warning-modal.component";
import {ModalService} from "../../../../../services/modal.service";

@Component({
  selector: 'app-edit-category-modal',
  templateUrl: './edit-category-modal.component.html',
  styleUrl: './edit-category-modal.component.css'
})
export class EditCategoryModalComponent implements OnInit {

  @Input() item: Category | null = null;
  form: FormGroup;
  confirm!: (result?: any) => void;
  close!: () => void;

  constructor(private fb: FormBuilder, private readonly categoriesService: CategoriesService, private readonly modalService: ModalService,) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.form.get('name')?.setValue(this.item?.name)
  }


  update() {
    if (!this.form.valid) {
      this.modalService.open(WarningModalComponent, {
          width: '450px',
        },
        {
          title: "Aviso",
          message: "Hay errores en el formulario, reviselo."
        }).then(async () => {

      })
      return
    }


    const command: UpdateCategory = {
      name: this.form.get('name')?.value
    }
    this.categoriesService.update(command, this.item?.id).subscribe({
      next: (category) => {
        this.confirm('update')
      },
      error: (err) => {
        console.error(err)
      }
    });
  }


}
