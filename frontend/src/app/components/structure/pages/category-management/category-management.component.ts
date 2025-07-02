import {Component, OnInit} from '@angular/core';
import {CategoriesService} from '../../../../services/categories.service';
import {Category} from '../../../../interfaces/categories';
import {firstValueFrom} from "rxjs";
import {UsersService} from "../../../../services/users.service";
import {AuthService} from "../../../../services/auth.service";
import {DeleteModalComponent} from "../../utilities/delete-modal/delete-modal.component";
import {ModalService} from "../../../../services/modal.service";
import {EditModalComponent} from "../main-management/edit-modal/edit-modal.component";
import {EditCategoryModalComponent} from "./edit-category-modal/edit-category-modal.component";
import {UtilitiesService} from "../../../../services/utilities.service";
import {AddCategoryModalComponent} from "./add-category-modal/add-category-modal.component";
import {User} from "../../../../interfaces/users";

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent implements OnInit {

  categories: Category[] = []

  user: User | any

  constructor(private readonly categoriesService: CategoriesService, private readonly userService: UsersService, private readonly authService: AuthService, private readonly modalService: ModalService, private readonly utilitiesService: UtilitiesService) {

  }

  async ngOnInit(): Promise<void> {
    this.user = await firstValueFrom(this.userService.getByToken(this.authService.getToken() ?? ''));
    await this.updateItems()

  }

  new(){

    this.modalService.open(AddCategoryModalComponent, {
        width: '90%',

      },
      {user: this.user}).then(async () => {
      await this.updateItems()
    })
      .catch(() => {
        this.modalService.close()
      });
  }

  update(item: Category) {
    this.modalService.open(EditCategoryModalComponent, {
        width: '90%',

      },
      {item: item}).then(async () => {
      await this.updateItems()
    })
      .catch(() => {
        this.modalService.close()
      });
  }

  toDate(date: string){
    return this.utilitiesService.transformDate(date)
  }

  delete(item: Category) {
    this.modalService.open(DeleteModalComponent, {
        width: '450px',
      },
      {
        title: "Eliminar",
        message: "¿Está seguro de que quiere eliminar el elemento " + item?.name + "?"
      }).then(async () => {
      this.categoriesService.delete(item.id).subscribe({
        next: async (category) => {
          await this.updateItems()
        },
        error: (err) => {
          console.error(err)
        }
      });
      await this.updateItems()
    })
      .catch(() => {
        console.log('✘ Cancelado');
        this.modalService.close()
      });
  }

  async updateItems() {
    this.categoriesService.getByUserId(this.user.id).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

}
