import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, BeforeInsert, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity';
import { Recipe } from 'src/recipes/recipes.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  path: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.images, { onDelete: 'CASCADE' })
  recipe: Recipe;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
