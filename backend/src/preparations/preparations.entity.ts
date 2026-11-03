import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from 'src/recipes/recipes.entity';

@Entity()
export class Preparations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  preparation: string;

  // Sin esto los pasos volvían en cualquier orden
  @Column({ default: 0 })
  position: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.preparations, {
    onDelete: 'CASCADE',
  })
  recipe: Recipe;
}
