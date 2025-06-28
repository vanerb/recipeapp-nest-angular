import { Component, OnInit } from '@angular/core';
import { CreateRecipe, Recipe } from '../../../../interfaces/recipes';
import { RecipesService } from '../../../../services/recipes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  recipes: Recipe[] = []

  constructor(private readonly recipesService: RecipesService, private readonly router: Router) {

  }


  ngOnInit() {

    this.recipesService.getAll().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
      },
      error: (err) => {
        console.error('Error loading recipes:', err);
      }
    });
  }

  async update(data: { type: string, item: any | null }) {
      
  
      if (data.type === 'details') {
        this.router.navigate(['/recipe/' + data.item.id]);
      }
  
     
    }

}
