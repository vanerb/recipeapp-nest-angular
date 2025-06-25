import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { User } from 'src/users/users.entity';
import { Recipe } from 'src/recipes/recipes.entity';
import { Image } from 'src/images/images.entity';
import { Preparations } from 'src/preparations/preparations.entity';

@Module({
      imports: [ TypeOrmModule.forFeature([Recipe, User, Image, Category, Preparations]),], // Asegúrate de que tus entidades estén registradas
      controllers: [CategoriesController],
      providers: [CategoriesService], 
})
export class CategoriesModule {}
