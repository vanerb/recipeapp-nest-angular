import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './categories.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAllCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategories();
  }

  @Get('byUserId/:id')
  getByUserId(@Param('id') id: string): Promise<Category[]> {
    return this.categoriesService.getByUserId(id);
  }

  @Post()
  async createCategory(
    @Body() createRecipeDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.createCategory(createRecipeDto);
  }

  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(id, updateRecipeDto);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}
