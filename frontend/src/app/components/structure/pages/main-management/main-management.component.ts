import {Component} from '@angular/core';
import {Recipe} from '../../../../interfaces/recipes';
import {RecipesService} from '../../../../services/recipes.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../../services/auth.service';
import {UsersService} from '../../../../services/users.service';
import {ModalService} from '../../../../services/modal.service';
import {AddModalComponent} from './add-modal/add-modal.component';
import {EditModalComponent} from './edit-modal/edit-modal.component';
import {DeleteModalComponent} from '../../utilities/delete-modal/delete-modal.component';
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-main-management',
  templateUrl: './main-management.component.html',
  styleUrl: './main-management.component.css'
})
export class MainManagementComponent {
  recipes: Recipe[] = []

  constructor(private readonly recipesService: RecipesService,
              private readonly router: Router,
              private readonly authService: AuthService,
              private readonly userService: UsersService,
              private readonly modalService: ModalService) {

  }


  async ngOnInit() {
    await this.updateItems()
  }

  async getUser() {
    const user = await firstValueFrom(this.userService.getByToken(this.authService.getToken() ?? ''));
    return user
  }

  async addRecipe() {
    this.modalService.open(AddModalComponent, {
        width: '90%',
        height: '90%'
      },
      {user: await this.getUser()}).then(async () => {
      await this.update({type: 'add', item: null})
    })
      .catch(() => {
        this.modalService.close()
      });
    ;
  }

  async update(data: { type: string, item: any | null }) {
    if (data.type === 'update') {
      console.log(data)


      this.modalService.open(EditModalComponent, {
          width: '90%',
          height: '90%'
        },
        {id: data.item.id, user:  await this.getUser()}).then(async () => {
        await this.updateItems()
      })
        .catch(() => {
          this.modalService.close()
        });

    } else if (data.type === 'details') {
      this.router.navigate(['/recipe/' + data.item.id]);
    } else if (data.type === 'add') {
      await this.updateItems()
    } else if (data.type === 'delete') {
      this.modalService.open(DeleteModalComponent, {
          width: '450px',
        },
        {
          title: "Eliminar",
          message: "¿Está seguro de que quiere eliminar el elemento " + data.item?.title + "?"
        }).then(async () => {
        this.recipesService.delete(data.item.id).subscribe({
          next: (recipe) => {
            this.updateItems()
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
  }

  async updateItems() {
    const user = await firstValueFrom(this.userService.getByToken(this.authService.getToken() ?? ''));


    this.recipesService.getByUserId(user.id).subscribe({
      next: (recipes) => {
        this.recipes = recipes;
      },
      error: (err) => {
        console.error('Error loading recipes:', err);
      }
    });
  }
}
