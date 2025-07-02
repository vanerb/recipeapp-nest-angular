import {Component, Input} from '@angular/core';
import {Category, CreateCategory, UpdateCategory} from "../../../../../interfaces/categories";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CategoriesService} from "../../../../../services/categories.service";
import {User} from "../../../../../interfaces/users";

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

  constructor(private fb: FormBuilder, private readonly categoriesService: CategoriesService) {
    this.form = this.fb.group({
      name: [''],
    });
  }

  ngOnInit() {
  }


  create() {
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
