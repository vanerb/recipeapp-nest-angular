import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from 'src/recipes/recipes.entity';
import { User } from 'src/users/users.entity';
import { Rating } from './ratings.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating) private ratingsRepository: Repository<Rating>,
    @InjectRepository(Recipe) private recipesRepository: Repository<Recipe>,
  ) {}

  private async summary(recipeId: string, userId: string) {
    const ratings = await this.ratingsRepository.findBy({ recipeId });
    const total = ratings.reduce((sum, rating) => sum + rating.value, 0);
    return {
      averageRating: ratings.length ? +(total / ratings.length).toFixed(1) : 0,
      ratingsCount: ratings.length,
      myRating: ratings.find((r) => r.userId === userId)?.value ?? null,
    };
  }

  getMine(recipeId: string, user: User) {
    return this.summary(recipeId, user.id);
  }

  async rate(recipeId: string, value: number, user: User) {
    const recipe = await this.recipesRepository.findOne({
      where: { id: recipeId },
      relations: ['user'],
    });
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }
    if (recipe.user.id === user.id) {
      throw new ForbiddenException('No puedes valorar tu propia receta');
    }

    const existing = await this.ratingsRepository.findOneBy({
      recipeId,
      userId: user.id,
    });
    await this.ratingsRepository.save(
      existing
        ? Object.assign(existing, { value })
        : this.ratingsRepository.create({ value, recipeId, userId: user.id }),
    );
    return this.summary(recipeId, user.id);
  }
}
