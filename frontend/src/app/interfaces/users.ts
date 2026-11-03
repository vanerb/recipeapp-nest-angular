export type UserRole = 'user' | 'admin';

export interface PublicUser {
  id: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
}

export interface CurrentUser extends PublicUser {
  email: string;
  role: UserRole;
}

export interface UserProfile extends PublicUser {
  recipesCount: number;
  postsCount: number;
  averageRating: number;
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
}

export interface Login {
  email: string;
  password: string;
}
