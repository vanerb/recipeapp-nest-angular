import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Recipe } from 'src/recipes/recipes.entity';
import { Category } from 'src/categories/categories.entity';
import { Post } from 'src/posts/posts.entity';

export type UserRole = 'user' | 'admin';

export const isAdmin = (user: User) => user.role === 'admin';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Exclude()
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Exclude()
  @Column({ type: 'varchar', length: 20, default: 'user' })
  role: UserRole;

  @Exclude()
  @Column({ default: false })
  isBlocked: boolean;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatar: string | null;

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Recipe[];

  @OneToMany(() => Category, (categories) => categories.user)
  categories: Category[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;
}
