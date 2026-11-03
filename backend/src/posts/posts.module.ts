import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from 'src/recipes/recipes.entity';
import { PostsController } from './posts.controller';
import { Post } from './posts.entity';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Recipe])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
