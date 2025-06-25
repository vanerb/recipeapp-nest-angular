import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, BeforeInsert, OneToMany, ManyToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Recipe } from 'src/recipes/recipes.entity';
import { Category } from 'src/categories/categories.entity';

@Entity()
export class Ingredients {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    ingredient: string;

    @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, { onDelete: 'CASCADE' })
    recipe: Recipe;
}
