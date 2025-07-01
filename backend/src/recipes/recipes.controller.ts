import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipes.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ParseJsonArrayPipe } from 'src/common/pipes/parse-json-array.pipe';
import { Ingredients } from 'src/ingredients/ingredients.entity';
import { Hashtags } from 'src/hashtags/hashtags.entity';
import { Preparations } from 'src/preparations/preparations.entity';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  getAllRecipes(): Promise<Recipe[]> {
    return this.recipesService.getAllRecipes();
  }

  @Get(':id')
  getRecipe(@Param('id') id: string): Promise<Recipe[]> {
    return this.recipesService.getRecipe(id);
  }

  @Get('user/:id')
  getRecipeByUserId(@Param('id') id: string): Promise<Recipe[]> {
    return this.recipesService.getRecipeByUserId(id);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/recipes',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createRecipe(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('userId') userId: string,
    @Body('categoryId') categoryId: string,
    @Body('hashtags', ParseJsonArrayPipe) hashtags: Hashtags[],
    @Body('ingredients', ParseJsonArrayPipe) ingredients: Ingredients[],
    @Body('preparations', ParseJsonArrayPipe) preparations: Preparations[],
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<Recipe> {
    const dto: CreateRecipeDto = {
      title,
      description,
      userId,
      categoryId,
      hashtags,
      ingredients,
      preparations,
    };

    return this.recipesService.createRecipe(dto, images);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/recipes',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateRecipe(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('userId') userId: string,
    @Body('categoryId') categoryId: string,
    @Body('hashtags', ParseJsonArrayPipe) hashtags: Hashtags[],
    @Body('ingredients', ParseJsonArrayPipe) ingredients: Ingredients[],
    @Body('preparations', ParseJsonArrayPipe) preparations: Preparations[],
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const dto: UpdateRecipeDto = {
      title,
      description,
      userId,
      categoryId,
      hashtags,
      ingredients,
      preparations,
    };
    return this.recipesService.updateRecipe(id, dto, images);
  }

  @Delete(':id')
  async deleteRecipe(@Param('id') id: string) {
    return this.recipesService.deleteRecipe(id);
  }
}
