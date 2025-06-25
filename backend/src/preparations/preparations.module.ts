import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Category } from 'src/categories/categories.entity';
import { Image } from 'src/images/images.entity';
import { PreparationsController } from './preparations.controller';
import { PreparationsService } from './preparations.service';
import { Recipe } from 'src/recipes/recipes.entity';
import { Preparations } from './preparations.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Recipe, User, Image, Category, Preparations])], // Asegúrate de que tus entidades estén registradas
  controllers: [PreparationsController],
  providers: [PreparationsService], 
})
export class PreparationsModule { }
