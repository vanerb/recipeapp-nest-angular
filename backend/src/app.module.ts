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
      entities: [User, Recipe, Category, Image],
      synchronize: true, // Solo para desarrollo
    }),
    TypeOrmModule.forFeature([User, Recipe, Category, Image]),
    UsersModule, // <-- Asegúrate de agregar esto
    RecipesModule,
    CategoriesModule,
    ImagesModule,
  ],
  controllers: [UsersController, RecipesController, CategoriesController, ImagesController],
  providers:[UsersService, RecipesService, CategoriesService, ImagesService],
})
export class AppModule {}
