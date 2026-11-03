import { PublicUser, UserRole } from './users';

export interface AdminStats {
  users: number;
  blockedUsers: number;
  recipes: number;
  posts: number;
  comments: number;
  ratings: number;
  categories: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  avatar: string | null;
  createdAt: string;
  recipesCount: number;
  postsCount: number;
}

export interface AdminComment {
  id: string;
  text: string;
  createdAt: string;
  user: PublicUser;
  recipe: { id: string; title: string };
}
