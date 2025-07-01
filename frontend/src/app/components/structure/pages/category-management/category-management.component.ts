import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../../services/categories.service';
import { Categories } from '../../../../interfaces/categories';
import {firstValueFrom} from "rxjs";
import {UsersService} from "../../../../services/users.service";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent implements OnInit {

  categories: Categories[] = []
  constructor(private readonly categoriesService: CategoriesService, private  readonly  userService: UsersService, private  readonly authService: AuthService) {

  }
  async ngOnInit(): Promise<void> {
    const user = await firstValueFrom(this.userService.getByToken(this.authService.getToken() ?? ''));
    this.categoriesService.getByUserId(user.id).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });

  }

}
