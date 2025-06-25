import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, BeforeInsert, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity';
import { Category } from 'src/categories/categories.entity';
import { Image } from 'src/images/images.entity';
import { Ingredients } from 'src/ingredients/ingredients.entity';
import { Preparations } from 'src/preparations/preparations.entity';
import { Hashtags } from 'src/hashtags/hashtags.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(() => Ingredients, (ingredient) => ingredient.recipe, { cascade: true })
  ingredients: Ingredients[];

  @OneToMany(() => Preparations, (preparation) => preparation.recipe, { cascade: true })
  preparations: Preparations[];

  @OneToMany(() => Hashtags, (hashtag) => hashtag.recipe, { cascade: true })
  hashtags: Preparations[];

  @ManyToOne(() => User, (user) => user.recipes)
  user: User;

  @ManyToOne(() => Category, (categories) => categories.recipe)
  category: Category;

  @OneToMany(() => Image, (image) => image.recipe, { cascade: true })
  images: Image[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
