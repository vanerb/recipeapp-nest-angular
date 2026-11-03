import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/categories.entity';
import { Comment } from 'src/comments/comments.entity';
import { Post } from 'src/posts/posts.entity';
import { Rating } from 'src/ratings/ratings.entity';
import { Recipe } from 'src/recipes/recipes.entity';
import { User } from 'src/users/users.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Recipe, Post, Comment, Rating, Category])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
