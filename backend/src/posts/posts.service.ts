import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { removeUpload } from 'src/common/uploads';
import { Recipe } from 'src/recipes/recipes.entity';
import { isAdmin, User } from 'src/users/users.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(Recipe) private recipesRepository: Repository<Recipe>,
  ) {}

  private find(where: FindOptionsWhere<Post>) {
    return this.postsRepository.find({
      where,
      relations: ['user', 'recipe'],
      order: { createdAt: 'DESC' },
    });
  }

  getAll(): Promise<Post[]> {
    return this.find({});
  }

  getByUser(userId: string): Promise<Post[]> {
    return this.find({ userId });
  }

  async create(
    dto: CreatePostDto,
    image: Express.Multer.File | undefined,
    user: User,
  ): Promise<Post> {
    if (!image) {
      throw new BadRequestException('La publicación necesita una foto');
    }
    const recipe = await this.recipesRepository.findOneBy({ id: dto.recipeId });
    if (!recipe) {
      throw new BadRequestException('La receta enlazada no existe');
    }

    const post = await this.postsRepository.save(
      this.postsRepository.create({
        caption: dto.caption.trim(),
        image: `/uploads/posts/${image.filename}`,
        user,
        recipe,
      }),
    );
    return (await this.find({ id: post.id }))[0];
  }

  async delete(id: string, user: User) {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Publicación no encontrada');
    }
    if (post.userId !== user.id && !isAdmin(user)) {
      throw new ForbiddenException('Esta publicación no es tuya');
    }
    await this.postsRepository.delete(id);
    await removeUpload(post.image);
  }
}
