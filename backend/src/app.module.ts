import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';
import { User } from './users/users.entity';
import { Recipe } from './recipes/recipes.entity';
import { UsersController } from './users/users.controller';
import { RecipesController } from './recipes/recipes.controller';
import { UsersService } from './users/users.service';
import { CategoriesService } from './categories/categories.service';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/categories.entity';
import { ImagesModule } from './images/images.module';
import { ImagesController } from './images/images.controller';
import { ImagesService } from './images/images.service';
import { Image } from './images/images.entity';
import { RecipesService } from './recipes/recipes.service';
import { Preparations } from './preparations/preparations.entity';
import { PreparationsModule } from './preparations/preparations.module';
import { PreparationsController } from './preparations/preparations.controller';
import { PreparationsService } from './preparations/preparations.service';
import { Ingredients } from './ingredients/ingredients.entity';
import { IngredientsModule } from './ingredients/ingredients.module';
import { IngredientsController } from './ingredients/ingredients.controller';
import { IngredientsService } from './ingredients/ingredients.service';
import { Hashtags } from './hashtags/hashtags.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 3306),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Recipe, Category, Image, Preparations, Ingredients, Hashtags],
      synchronize: true, // Solo para desarrollo
    }),
    TypeOrmModule.forFeature([User, Recipe, Category, Image, Preparations, Ingredients]),
    UsersModule, // <-- Asegúrate de agregar esto
    RecipesModule,
    CategoriesModule,
    ImagesModule,
    PreparationsModule,
    IngredientsModule
  ],
  controllers: [UsersController, RecipesController, CategoriesController, ImagesController, PreparationsController, IngredientsController],
  providers:[UsersService, RecipesService, CategoriesService, ImagesService, PreparationsService, IngredientsService],
})
export class AppModule {}
