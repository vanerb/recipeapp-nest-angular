import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Category } from 'src/categories/categories.entity';
import { Image } from 'src/images/images.entity';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';
import { Recipe } from 'src/recipes/recipes.entity';
import { Preparations } from 'src/preparations/preparations.entity';
import { Ingredients } from './ingredients.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Recipe, User, Image, Category, Preparations, Ingredients])], // Asegúrate de que tus entidades estén registradas
  controllers: [IngredientsController],
  providers: [IngredientsService], 
})
export class IngredientsModule { }
