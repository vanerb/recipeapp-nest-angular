import { Recipe } from "./recipes";

export interface AddIngredients {
    ingredient: string;
}

export interface Ingredients {
    id: string;
    ingredient: string;
    recipe: Recipe;
}
