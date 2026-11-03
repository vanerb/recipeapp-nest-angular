import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from 'src/recipes/recipes.entity';
import { RatingsController } from './ratings.controller';
import { Rating } from './ratings.entity';
import { RatingsService } from './ratings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Recipe])],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}
