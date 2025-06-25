import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Category } from 'src/categories/categories.entity';
import { Image } from 'src/images/images.entity';
import { Recipe } from 'src/recipes/recipes.entity';
import { Preparations } from 'src/preparations/preparations.entity';
import { HashtagsController } from './hashtags.controller';
import { HashtagsService } from './hashtags.service';
import { Ingredients } from 'src/ingredients/ingredients.entity';
import { Hashtags } from './hashtags.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Recipe, User, Image, Category, Preparations, Ingredients, Hashtags])], // Asegúrate de que tus entidades estén registradas
  controllers: [HashtagsController],
  providers: [HashtagsService], 
})
export class HashtagsModule { }
