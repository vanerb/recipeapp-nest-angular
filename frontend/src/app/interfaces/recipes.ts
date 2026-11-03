import { Category } from './categories';
import { PublicUser } from './users';

export interface RecipeImage {
  id: string;
  url: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  hashtags: { id: string; hashtag: string }[];
  ingredients: { id: string; ingredient: string }[];
  preparations: { id: string; preparation: string }[];
  images: RecipeImage[];
  category: Category | null;
  user: PublicUser;
  averageRating: number;
  ratingsCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface RecipeFilters {
  search?: string;
  categoryId?: string;
  hashtag?: string;
  sort?: 'recent' | 'top';
}

export interface RatingSummary {
  averageRating: number;
  ratingsCount: number;
  myRating: number | null;
}

export interface RecipeComment {
  id: string;
  text: string;
  createdAt: string;
  user: PublicUser;
}
