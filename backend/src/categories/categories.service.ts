import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private cateoriesRepository: Repository<Category>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return await this.cateoriesRepository.find();
  }

  async getByUserId(id: string): Promise<Category[]> {
    return await this.cateoriesRepository.find({
      where: { user: { id } },
      relations: ['user'],
    });
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const user = await this.userRepository.findOne({
      where: { id: createCategoryDto.userId },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const newCategory = this.cateoriesRepository.create({
      ...createCategoryDto,
      user,
    });
    return this.cateoriesRepository.save(newCategory);
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.cateoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.cateoriesRepository.update(id, updateCategoryDto);
    const updatedCategory = await this.cateoriesRepository.findOne({
      where: { id },
    });
    const { ...categoryUpdated } = updatedCategory;
    return categoryUpdated;
  }

  async deleteCategory(id: string) {
    const category = await this.cateoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    this.cateoriesRepository.delete(id);
  }
}
