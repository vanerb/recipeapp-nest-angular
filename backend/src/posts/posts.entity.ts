import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from 'src/recipes/recipes.entity';
import { User } from 'src/users/users.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  caption: string;

  @Column()
  image: string;

  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // La receta a la que enlaza la publicación
  @ManyToOne(() => Recipe, { onDelete: 'CASCADE' })
  recipe: Recipe;

  @CreateDateColumn()
  createdAt: Date;
}
