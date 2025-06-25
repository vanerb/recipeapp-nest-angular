import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipes.entity';
import { User } from 'src/users/users.entity';
import { Category } from 'src/categories/categories.entity';
import { Image } from 'src/images/images.entity';
import { Preparations } from 'src/preparations/preparations.entity';
import { Ingredients } from 'src/ingredients/ingredients.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Recipe, User, Image, Category, Preparations, Ingredients])], // Asegúrate de que tus entidades estén registradas
  controllers: [RecipesController],
  providers: [RecipesService], 
})
export class RecipesModule { }
