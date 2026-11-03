import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { Category } from '../../../../interfaces/categories';
import { Recipe, RecipeFilters } from '../../../../interfaces/recipes';
import { CategoriesService } from '../../../../services/categories.service';
import { RecipesService } from '../../../../services/recipes.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  categories: Category[] = [];
  loading = true;
  failed = false;

  // Los filtros viven en la URL: se pueden compartir y sobreviven al botón atrás
  search = '';
  categoryId: string | null = null;
  hashtag: string | null = null;
  sort: 'recent' | 'top' = 'recent';

  private readonly searchChanges = new Subject<string>();
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly recipesService: RecipesService,
    private readonly categoriesService: CategoriesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.categoriesService.getAll().subscribe((categories) => {
      this.categories = categories;
    });

    this.subscriptions.add(
      this.searchChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((search) => this.updateFilters({ search: search || null })),
    );

    this.subscriptions.add(
      this.route.queryParamMap
        .pipe(
          tap((params) => {
            this.search = params.get('search') ?? '';
            this.categoryId = params.get('category');
            this.hashtag = params.get('hashtag');
            this.sort = params.get('sort') === 'top' ? 'top' : 'recent';
            this.loading = true;
            this.failed = false;
          }),
          switchMap(() =>
            this.recipesService.getAll(this.filters()).pipe(
              catchError(() => {
                this.failed = true;
                return of([]);
              }),
            ),
          ),
        )
        .subscribe((recipes) => {
          this.recipes = recipes;
          this.loading = false;
        }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private filters(): RecipeFilters {
    return {
      search: this.search,
      categoryId: this.categoryId ?? undefined,
      hashtag: this.hashtag ?? undefined,
      sort: this.sort,
    };
  }

  get hasFilters(): boolean {
    return !!(this.search || this.categoryId || this.hashtag);
  }

  onSearch(value: string) {
    this.searchChanges.next(value.trim());
  }

  updateFilters(params: Record<string, string | null>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  clearFilters() {
    this.searchChanges.next('');
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });
  }
}
