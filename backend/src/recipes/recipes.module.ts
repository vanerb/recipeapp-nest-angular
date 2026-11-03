import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/categories.entity';
import { Comment } from 'src/comments/comments.entity';
import { Image } from 'src/images/images.entity';
import { Rating } from 'src/ratings/ratings.entity';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, Image, Category, Rating, Comment])],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
