import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Recipe } from 'src/recipes/recipes.entity';
import { User } from 'src/users/users.entity';

// Una valoración por usuario y receta: votar de nuevo la sustituye
@Entity()
@Unique(['userId', 'recipeId'])
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  value: number;

  @Column({ type: 'varchar', length: 36 })
  recipeId: string;

  @ManyToOne(() => Recipe, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
