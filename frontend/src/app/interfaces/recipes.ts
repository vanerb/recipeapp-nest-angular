import { Categories } from "./categories";
import { AddHashtags, Hashtags } from "./hashtags";
import { AddIngredients, Ingredients } from "./ingredients";
import { AddPreparations, Preparations } from "./preparations";

export interface Recipes {
    id: string;
    title: string;
    description: string;
    hashtags: string;
    userId: string;
    categoryId: string;
    recipeDescription: string;
    images: File;
}

export interface CreateRecipe {
    title: string;
    description: string;
    hashtags: AddHashtags[];
    ingredients: AddIngredients[];
    preparations: AddPreparations[]
    userId: string;
    categoryId: string;
    images: { type: string, file: File }[];
}

export interface UpdateRecipe {
    id: string;
    title: string;
    description: string;
    hashtags: AddHashtags[];
    ingredients: AddIngredients[];
    preparations: AddPreparations[]
    userId: string;
    categoryId: string;
    images: { type: string, file: File }[];
}

export interface Recipe {
    id: string;
    title: string;
    description: string;
    hashtags: Hashtags[];
    userId: string;
    category: Categories;
    ingredients: Ingredients[];
    preparations: Preparations[];
    images: Image[];
}

export interface Image {
    id: string,
    url: string,
    path: string,
    createdAt: string,
    updatedAt: string
}