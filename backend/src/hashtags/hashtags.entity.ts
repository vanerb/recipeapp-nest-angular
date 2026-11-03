import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from 'src/recipes/recipes.entity';

@Entity()
export class Hashtags {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hashtag: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.hashtags, { onDelete: 'CASCADE' })
  recipe: Recipe;
}
