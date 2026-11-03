import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/categories.entity';
import { Comment } from 'src/comments/comments.entity';
import { Post } from 'src/posts/posts.entity';
import { Rating } from 'src/ratings/ratings.entity';
import { Recipe } from 'src/recipes/recipes.entity';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Recipe) private recipesRepository: Repository<Recipe>,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    @InjectRepository(Rating) private ratingsRepository: Repository<Rating>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private readonly usersService: UsersService,
  ) {}

  async getStats() {
    const [users, blockedUsers, recipes, posts, comments, ratings, categories] =
      await Promise.all([
        this.usersRepository.count(),
        this.usersRepository.countBy({ isBlocked: true }),
        this.recipesRepository.count(),
        this.postsRepository.count(),
        this.commentsRepository.count(),
        this.ratingsRepository.count(),
        this.categoriesRepository.count(),
      ]);
    return { users, blockedUsers, recipes, posts, comments, ratings, categories };
  }

  // Objetos planos: aquí la administración sí debe ver correo, rol y bloqueo
  private toRow(user: User, recipesCount = 0, postsCount = 0) {
    const { id, name, email, role, isBlocked, avatar, createdAt } = user;
    return {
      id,
      name,
      email,
      role,
      isBlocked,
      avatar,
      createdAt,
      recipesCount,
      postsCount,
    };
  }

  async getUsers() {
    const [users, recipeCounts, postCounts] = await Promise.all([
      this.usersRepository.find({ order: { createdAt: 'DESC' } }),
      this.recipesRepository
        .createQueryBuilder('recipe')
        .innerJoin('recipe.user', 'user')
        .select('user.id', 'userId')
        .addSelect('COUNT(*)', 'total')
        .groupBy('user.id')
        .getRawMany<{ userId: string; total: string }>(),
      this.postsRepository
        .createQueryBuilder('post')
        .select('post.userId', 'userId')
        .addSelect('COUNT(*)', 'total')
        .groupBy('post.userId')
        .getRawMany<{ userId: string; total: string }>(),
    ]);

    const total = (rows: { userId: string; total: string }[], id: string) =>
      +(rows.find((row) => row.userId === id)?.total ?? 0);

    return users.map((user) =>
      this.toRow(user, total(recipeCounts, user.id), total(postCounts, user.id)),
    );
  }

  getComments(): Promise<Comment[]> {
    return this.commentsRepository.find({
      relations: ['user', 'recipe'],
      order: { createdAt: 'DESC' },
    });
  }

  // Sobre la propia cuenta no se actúa: siempre queda al menos una administración activa
  private async findOther(id: string, admin: User): Promise<User> {
    if (id === admin.id) {
      throw new BadRequestException(
        'No puedes cambiar tu propia cuenta desde aquí',
      );
    }
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async updateUser(id: string, dto: UpdateUserAdminDto, admin: User) {
    const user = await this.findOther(id, admin);
    if (dto.role !== undefined) {
      user.role = dto.role;
    }
    if (dto.isBlocked !== undefined) {
      user.isBlocked = dto.isBlocked;
    }
    return this.toRow(await this.usersRepository.save(user));
  }

  async deleteUser(id: string, admin: User) {
    const user = await this.findOther(id, admin);
    await this.usersService.deleteUser(user);
  }
}
