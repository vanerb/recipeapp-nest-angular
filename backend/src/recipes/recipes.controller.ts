import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
import { imageUpload } from 'src/common/uploads';
import { User } from 'src/users/users.entity';
import { RecipeFilters, RecipesService } from './recipes.service';
import { Recipe } from './recipes.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  getAllRecipes(@Query() filters: RecipeFilters): Promise<Recipe[]> {
    return this.recipesService.getAllRecipes(filters);
  }

  @Get('user/:id')
  getRecipeByUserId(@Param('id') id: string): Promise<Recipe[]> {
    return this.recipesService.getRecipeByUserId(id);
  }

  @Get(':id')
  getRecipe(@Param('id') id: string): Promise<Recipe> {
    return this.recipesService.getRecipe(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10, imageUpload('recipes')))
  createRecipe(
    @Body() dto: CreateRecipeDto,
    @UploadedFiles() images: Express.Multer.File[],
    @CurrentUser() user: User,
  ): Promise<Recipe> {
    return this.recipesService.createRecipe(dto, images, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10, imageUpload('recipes')))
  updateRecipe(
    @Param('id') id: string,
    @Body() dto: UpdateRecipeDto,
    @UploadedFiles() images: Express.Multer.File[],
    @CurrentUser() user: User,
  ): Promise<Recipe> {
    return this.recipesService.updateRecipe(id, dto, images, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteRecipe(@Param('id') id: string, @CurrentUser() user: User) {
    return this.recipesService.deleteRecipe(id, user);
  }
}
