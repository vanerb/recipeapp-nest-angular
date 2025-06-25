import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, BeforeInsert, OneToMany, ManyToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Recipe } from 'src/recipes/recipes.entity';
import { Category } from 'src/categories/categories.entity';

@Entity()
export class Hashtags {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    hashtag: string;

    @ManyToOne(() => Recipe, (recipe) => recipe.hashtags, { onDelete: 'CASCADE' })
     recipe: Recipe;
}
