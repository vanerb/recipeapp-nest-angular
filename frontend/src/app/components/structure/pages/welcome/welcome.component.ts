import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Category } from '../../../../interfaces/categories';
import { Post } from '../../../../interfaces/posts';
import { Recipe } from '../../../../interfaces/recipes';
import { AuthService } from '../../../../services/auth.service';
import { CategoriesService } from '../../../../services/categories.service';
import { PostsService } from '../../../../services/posts.service';
import { RecipesService } from '../../../../services/recipes.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent implements OnInit {
  topRecipes: Recipe[] = [];
  posts: Post[] = [];
  categories: Category[] = [];
  loading = true;
  failed = false;

  constructor(
    readonly authService: AuthService,
    private readonly recipesService: RecipesService,
    private readonly postsService: PostsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  ngOnInit() {
    forkJoin({
      recipes: this.recipesService.getAll({ sort: 'top' }),
      posts: this.postsService.getAll(),
      categories: this.categoriesService.getAll(),
    }).subscribe({
      next: ({ recipes, posts, categories }) => {
        this.topRecipes = recipes.slice(0, 3);
        this.posts = posts.slice(0, 3);
        this.categories = categories;
        this.loading = false;
      },
      error: () => {
        this.failed = true;
        this.loading = false;
      },
    });
  }
}
