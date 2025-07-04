import {Component, Input} from '@angular/core';
import {Category, CreateCategory, UpdateCategory} from "../../../../../interfaces/categories";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../../../../services/categories.service";
import {User} from "../../../../../interfaces/users";
import {WarningModalComponent} from "../../../utilities/warning-modal/warning-modal.component";
import {ModalService} from "../../../../../services/modal.service";

@Component({
  selector: 'app-add-category-modal',
  templateUrl: './add-category-modal.component.html',
  styleUrl: './add-category-modal.component.css'
})
export class AddCategoryModalComponent {
  @Input() user?: User
  form: FormGroup;
  confirm!: (result?: any) => void;
  close!: () => void;

  constructor(private fb: FormBuilder, private readonly categoriesService: CategoriesService, private readonly modalService: ModalService) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }


  create() {

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

    const command: CreateCategory = {
      name: this.form.get('name')?.value,
      userId: this.user?.id
    }
    this.categoriesService.create(command).subscribe({
      next: (category) => {
        this.confirm('add')
      },
      error: (err) => {
        console.error(err)
      }
    });
    ;
    ;
  }
}
