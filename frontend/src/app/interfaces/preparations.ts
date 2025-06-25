import { Recipe } from "./recipes";

export interface AddPreparations {
    preparation: string;
}


export interface Preparations {
    id: string;
    preparation: string;
    recipe: Recipe
}
