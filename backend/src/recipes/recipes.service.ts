import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipes.entity';
import * as bcrypt from 'bcrypt';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Category } from 'src/categories/categories.entity';
import { User } from 'src/users/users.entity';
import { Image } from 'src/images/images.entity';
import { Hashtags } from 'src/hashtags/hashtags.entity';
import { Preparations } from 'src/preparations/preparations.entity';
import { Ingredients } from 'src/ingredients/ingredients.entity';
import { CreateHashtagDto } from 'src/hashtags/dto/create-hashtag.dto';
import { CreatePreaparationDto } from 'src/preparations/dto/create-preparation.dto';
import { CreateIngredientDto } from 'src/ingredients/dto/create-ingredient.dto';

@Injectable()
export class RecipesService {
    constructor(
        @InjectRepository(Recipe) private recipesRepository: Repository<Recipe>,
        @InjectRepository(Category) private cateoriesRepository: Repository<Category>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Image)
        private imageRepository: Repository<Image>,
    ) { }

    async getAllRecipes(): Promise<Recipe[]> {
        return await this.recipesRepository.find({
            relations: ['images', 'ingredients', 'hashtags', 'preparations'],
        });
    }

    async getRecipe(id: string): Promise<Recipe[]> {
        return await this.recipesRepository.find({
            where: { id },
            relations: ['images', 'ingredients', 'hashtags', 'preparations'],
        });
    }

    async createRecipe(createRecipeDto: CreateRecipeDto, images: Express.Multer.File[]): Promise<Recipe> {
        // Buscar usuario y categoría
        const user = await this.userRepository.findOne({ where: { id: createRecipeDto.userId } });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const category = await this.cateoriesRepository.findOne({ where: { id: createRecipeDto.categoryId } });
        if (!category) {
            throw new Error('Categoría no encontrada');
        }

        let newRecipe = this.recipesRepository.create({ ...createRecipeDto, user, category });

        newRecipe = await this.recipesRepository.save(newRecipe);

        if (images) {
            const imageEntities = images.map((file) => {
                const image = new Image();
                image.url = `/uploads/recipes/${file.filename}`;
                image.recipe = newRecipe;
                return image;
            });

            await this.imageRepository.save(imageEntities);
        }


        return newRecipe;
    }


    async updateRecipe(id: string, updateRecipeDto: UpdateRecipeDto, images: Express.Multer.File[]): Promise<Recipe> {
        const recipe = await this.recipesRepository.findOne({
            where: { id },
            relations: ['images'],
        });

        if (!recipe) {
            throw new NotFoundException(`Recipe with ID ${id} not found`);
        }

        const oldImages = recipe.images;

        Object.assign(recipe, updateRecipeDto);

        if (images && images.length > 0) {
            const newImageEntities = images.map((file) => {
                const image = new Image();
                image.url = `/uploads/recipes/${file.filename}`;
                image.recipe = recipe;
                return image;
            });

            await this.imageRepository.save(newImageEntities);

            recipe.images = newImageEntities;
        }

        await this.recipesRepository.save(recipe);

        for (const image of oldImages) {
            const count = await this.imageRepository.count({
                where: { url: image.url },
            });

            if (count === 1) {
                await this.imageRepository.remove(image);
            }
        }


        const updatedRecipe = await this.recipesRepository.findOne({ where: { id } });
        const { ...recipeUpdated } = updatedRecipe;
        return recipeUpdated;
    }

    async deleteRecipe(id: string) {
        const recipe = await this.recipesRepository.findOne({
            where: { id },
            relations: ['images'],
        });

        if (!recipe) {
            throw new NotFoundException(`Recipe with ID ${id} not found`);
        }

        const imagesToDelete = recipe.images;

        await this.recipesRepository.remove(recipe);

        for (const image of imagesToDelete) {
            const count = await this.imageRepository.count({ where: { url: image.url } });

            if (count === 0) {
                await this.imageRepository.remove(image);
            }
        }
    }
}
