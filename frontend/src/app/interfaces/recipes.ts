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
    hashtags: string;
    userId: string;
    categoryId: string;
    recipeDescription: string;
    images: File;
}

export interface UpdateRecipe {
    id: string;
    title: string;
    description: string;
    hashtags: string;
    userId: string;
    categoryId: string;
    recipeDescription: string;
    images: File;
}

export interface Recipe {
    id: string;
    title: string;
    description: string;
    hashtags: string;
    userId: string;
    categoryId: string;
    recipeDescription: string;
    images: File;
}