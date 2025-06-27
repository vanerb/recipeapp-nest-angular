import { Component } from '@angular/core';
import { Recipe } from '../../../../interfaces/recipes';
import { RecipesService } from '../../../../services/recipes.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { UsersService } from '../../../../services/users.service';
import { ModalService } from '../../../../services/modal.service';
import { AddModalComponent } from './add-modal/add-modal.component';

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

    const user = await this.userService.getByToken(this.authService.getToken() ?? '');


    this.recipesService.getByUserId(user.id).subscribe({
      next: (recipes) => {
        this.recipes = recipes;
      },
      error: (err) => {
        console.error('Error loading recipes:', err);
      }
    });
  }

  addRecipe() {
    this.modalService.open(AddModalComponent, {
      width: '90%',
      height: '90%'
    });
  }
}
