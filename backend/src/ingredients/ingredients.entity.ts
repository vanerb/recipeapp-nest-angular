import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from 'src/recipes/recipes.entity';

@Entity()
export class Ingredients {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ingredient: string;

  @Column({ default: 0 })
  position: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, {
    onDelete: 'CASCADE',
  })
  recipe: Recipe;
}
