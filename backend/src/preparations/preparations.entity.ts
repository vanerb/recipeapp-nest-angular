import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, BeforeInsert, OneToMany, ManyToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Recipe } from 'src/recipes/recipes.entity';
import { Category } from 'src/categories/categories.entity';

@Entity()
export class Preparations {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    preparation: string;

    @ManyToOne(() => Recipe, (recipe) => recipe.preparations, { onDelete: 'CASCADE' })
    recipe: Recipe;
}
