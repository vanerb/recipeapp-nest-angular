import { Recipe } from "./recipes";

export interface AddHashtags {
    hashtag: string;
}

export interface Hashtags {
    id: string;
    hashtag: string;
    recipe: Recipe;
}
