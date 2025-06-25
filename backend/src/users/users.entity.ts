import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Recipe } from 'src/recipes/recipes.entity';
import { Category } from 'src/categories/categories.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;
    
    @Column()
    token: string;

    @OneToMany(() => Recipe, (recipe) => recipe.user)
    recipes: Recipe[];

    @OneToMany(() => Category, (categories) => categories.user)
    categories: Category[];

}
