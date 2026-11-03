import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/posts/posts.entity';
import { Rating } from 'src/ratings/ratings.entity';
import { Recipe } from 'src/recipes/recipes.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';

// Global porque JwtAuthGuard lo necesita en todos los módulos
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Recipe, Post, Rating])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
