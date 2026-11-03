import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
import { User } from 'src/users/users.entity';
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
  @UseGuards(JwtAuthGuard)
  createCategory(
    @Body() dto: CreateCategoryDto,
    @CurrentUser() user: User,
  ): Promise<Category> {
    return this.categoriesService.createCategory(dto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() user: User,
  ) {
    return this.categoriesService.updateCategory(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteCategory(@Param('id') id: string, @CurrentUser() user: User) {
    return this.categoriesService.deleteCategory(id, user);
  }
}
