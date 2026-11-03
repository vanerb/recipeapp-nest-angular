import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from 'src/recipes/recipes.entity';
import { isAdmin, User } from 'src/users/users.entity';
import { Comment } from './comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    @InjectRepository(Recipe) private recipesRepository: Repository<Recipe>,
  ) {}

  getByRecipe(recipeId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { recipeId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(recipeId: string, text: string, user: User): Promise<Comment> {
    if (!(await this.recipesRepository.existsBy({ id: recipeId }))) {
      throw new NotFoundException('Receta no encontrada');
    }
    const trimmed = text.trim();
    if (!trimmed) {
      throw new BadRequestException('El comentario está vacío');
    }
    return this.commentsRepository.save(
      this.commentsRepository.create({ text: trimmed, recipeId, user }),
    );
  }

  // Puede borrarlo su autor, el dueño de la receta o la administración
  async delete(id: string, user: User) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['user', 'recipe', 'recipe.user'],
    });
    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }
    if (
      comment.user.id !== user.id &&
      comment.recipe.user.id !== user.id &&
      !isAdmin(user)
    ) {
      throw new ForbiddenException('No puedes borrar este comentario');
    }
    await this.commentsRepository.delete(id);
  }
}
