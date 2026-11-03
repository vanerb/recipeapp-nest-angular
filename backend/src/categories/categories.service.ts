import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isAdmin, User } from 'src/users/users.entity';
import { Category } from './categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find({ order: { name: 'ASC' } });
  }

  getByUserId(id: string): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { user: { id } },
      order: { name: 'ASC' },
    });
  }

  // Las categorías son compartidas: se evita que cada usuario cree "Postres"
  private async assertNameIsFree(name: string, ignoreId?: string) {
    const categories = await this.categoriesRepository.find();
    const taken = categories.some(
      (category) =>
        category.id !== ignoreId &&
        category.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (taken) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }
  }

  private async findOwned(id: string, user: User): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    if (category.user?.id !== user.id && !isAdmin(user)) {
      throw new ForbiddenException('Esta categoría no es tuya');
    }
    return category;
  }

  async createCategory(dto: CreateCategoryDto, user: User): Promise<Category> {
    await this.assertNameIsFree(dto.name);
    const name = dto.name.trim();
    return this.categoriesRepository.save(
      this.categoriesRepository.create({ name, user }),
    );
  }

  async updateCategory(
    id: string,
    dto: UpdateCategoryDto,
    user: User,
  ): Promise<Category> {
    const category = await this.findOwned(id, user);
    await this.assertNameIsFree(dto.name, id);
    category.name = dto.name.trim();
    return this.categoriesRepository.save(category);
  }

  async deleteCategory(id: string, user: User) {
    await this.findOwned(id, user);
    await this.categoriesRepository.delete(id);
  }
}
