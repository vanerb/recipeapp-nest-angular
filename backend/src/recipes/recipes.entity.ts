import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, BeforeInsert, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity';
import { Category } from 'src/categories/categories.entity';
import { Image } from 'src/images/images.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

 
  @Column()
  description: string;
  
  @Column()
  recipeDescription: string;

  @Column()
  hashtags: string;

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
