import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from 'src/recipes/recipes.entity';
import { CommentsController } from './comments.controller';
import { Comment } from './comments.entity';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Recipe])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
