import { PublicUser } from './users';

export interface Post {
  id: string;
  caption: string;
  image: string;
  createdAt: string;
  user: PublicUser;
  recipe: { id: string; title: string };
}
