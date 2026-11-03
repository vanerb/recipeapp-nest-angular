import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Recipe } from 'src/recipes/recipes.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  // La primera imagen es la portada
  @Column({ default: 0 })
  position: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.images, { onDelete: 'CASCADE' })
  recipe: Recipe;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
