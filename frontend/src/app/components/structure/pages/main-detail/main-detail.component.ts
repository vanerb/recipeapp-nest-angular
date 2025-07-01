import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../../../../services/recipes.service';
import { Recipe } from '../../../../interfaces/recipes';
import { ActivatedRoute } from '@angular/router';
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-main-detail',
  templateUrl: './main-detail.component.html',
  styleUrl: './main-detail.component.css'
})
export class MainDetailComponent implements OnInit {

  recipe: Recipe | null = null
  constructor(private readonly recipesService: RecipesService, private readonly route: ActivatedRoute) {

  }

  async ngOnInit(): Promise<void> {
    const recipeId = this.route.snapshot.paramMap.get('id') ?? ""
    this.recipe = await this.recipesService.get(recipeId)

    console.log("RECIPE", this.recipe)
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/no-image.jpg';
  }


}
