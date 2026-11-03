import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { Category } from 'src/categories/categories.entity';
import { Comment } from 'src/comments/comments.entity';
import { removeUpload } from 'src/common/uploads';
import { Hashtags } from 'src/hashtags/hashtags.entity';
import { Image } from 'src/images/images.entity';
import { Ingredients } from 'src/ingredients/ingredients.entity';
import { Preparations } from 'src/preparations/preparations.entity';
import { Rating } from 'src/ratings/ratings.entity';
import { isAdmin, User } from 'src/users/users.entity';
import { Recipe } from './recipes.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

export interface RecipeFilters {
  search?: string;
  categoryId?: string;
  hashtag?: string;
  sort?: string;
}

const RELATIONS = [
  'images',
  'category',
  'ingredients',
  'hashtags',
  'preparations',
  'user',
];

const CHILD_ORDER = {
  images: { position: 'ASC' },
  ingredients: { position: 'ASC' },
  preparations: { position: 'ASC' },
} as const;

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe) private recipesRepository: Repository<Recipe>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    @InjectRepository(Rating) private ratingsRepository: Repository<Rating>,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}

  // Añade a cada receta su media de estrellas y sus contadores
  private async withStats(recipes: Recipe[]): Promise<Recipe[]> {
    if (recipes.length === 0) {
      return recipes;
    }
    const recipeId = In(recipes.map((recipe) => recipe.id));
    const [ratings, comments] = await Promise.all([
      this.ratingsRepository.find({
        where: { recipeId },
        select: ['recipeId', 'value'],
      }),
      this.commentsRepository.find({
        where: { recipeId },
        select: ['recipeId'],
      }),
    ]);

    for (const recipe of recipes) {
      const values = ratings
        .filter((rating) => rating.recipeId === recipe.id)
        .map((rating) => rating.value);
      const total = values.reduce((sum, value) => sum + value, 0);
      recipe.ratingsCount = values.length;
      recipe.averageRating = values.length
        ? +(total / values.length).toFixed(1)
        : 0;
      recipe.commentsCount = comments.filter(
        (comment) => comment.recipeId === recipe.id,
      ).length;
    }
    return recipes;
  }

  async getAllRecipes(filters: RecipeFilters = {}): Promise<Recipe[]> {
    const base: FindOptionsWhere<Recipe> = filters.categoryId
      ? { category: { id: filters.categoryId } }
      : {};
    const term = filters.search?.trim();
    const where = term
      ? [
          { ...base, title: Like(`%${term}%`) },
          { ...base, description: Like(`%${term}%`) },
        ]
      : base;

    let recipes = await this.recipesRepository.find({
      where,
      relations: RELATIONS,
      order: { createdAt: 'DESC', ...CHILD_ORDER },
    });

    // Se filtra aquí: filtrar en la consulta recortaría los hashtags cargados
    const hashtag = filters.hashtag?.toLowerCase();
    if (hashtag) {
      recipes = recipes.filter((recipe) =>
        recipe.hashtags.some((item) => item.hashtag === hashtag),
      );
    }

    await this.withStats(recipes);

    if (filters.sort === 'top') {
      recipes.sort(
        (a, b) =>
          b.averageRating! - a.averageRating! ||
          b.ratingsCount! - a.ratingsCount!,
      );
    }
    return recipes;
  }

  async getRecipeByUserId(id: string): Promise<Recipe[]> {
    const recipes = await this.recipesRepository.find({
      where: { user: { id } },
      relations: RELATIONS,
      order: { createdAt: 'DESC', ...CHILD_ORDER },
    });
    return this.withStats(recipes);
  }

  async getRecipe(id: string): Promise<Recipe> {
    const recipe = await this.recipesRepository.findOne({
      where: { id },
      relations: RELATIONS,
      order: CHILD_ORDER,
    });
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }
    await this.withStats([recipe]);
    return recipe;
  }

  private async findCategory(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new BadRequestException('La categoría no existe');
    }
    return category;
  }

  private children(dto: CreateRecipeDto) {
    const clean = (items: string[] = []) =>
      items.map((item) => item.trim()).filter(Boolean);

    const tags = clean(dto.hashtags).map((tag) =>
      tag.replace(/^#+/, '').toLowerCase(),
    );

    return {
      ingredients: clean(dto.ingredients).map((ingredient, position) =>
        Object.assign(new Ingredients(), { ingredient, position }),
      ),
      preparations: clean(dto.preparations).map((preparation, position) =>
        Object.assign(new Preparations(), { preparation, position }),
      ),
      hashtags: [...new Set(tags)]
        .filter(Boolean)
        .map((hashtag) => Object.assign(new Hashtags(), { hashtag })),
    };
  }

  async createRecipe(
    dto: CreateRecipeDto,
    files: Express.Multer.File[] = [],
    user: User,
  ): Promise<Recipe> {
    const category = await this.findCategory(dto.categoryId);

    const recipe = await this.recipesRepository.save(
      this.recipesRepository.create({
        title: dto.title.trim(),
        description: dto.description.trim(),
        user,
        category,
        ...this.children(dto),
        images: files.map((file, position) =>
          Object.assign(new Image(), {
            url: `/uploads/recipes/${file.filename}`,
            position,
          }),
        ),
      }),
    );
    return this.getRecipe(recipe.id);
  }

  private async findOwned(id: string, user: User): Promise<Recipe> {
    const recipe = await this.recipesRepository.findOne({
      where: { id },
      relations: ['user', 'images'],
      order: { images: { position: 'ASC' } },
    });
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }
    if (recipe.user.id !== user.id && !isAdmin(user)) {
      throw new ForbiddenException('Esta receta no es tuya');
    }
    return recipe;
  }

  async updateRecipe(
    id: string,
    dto: UpdateRecipeDto,
    files: Express.Multer.File[] = [],
    user: User,
  ): Promise<Recipe> {
    const recipe = await this.findOwned(id, user);
    const category = await this.findCategory(dto.categoryId);

    // Sin keepImageIds se conservan todas: antes editar sin subir fotos las borraba
    const kept = dto.keepImageIds
      ? recipe.images.filter((image) => dto.keepImageIds!.includes(image.id))
      : recipe.images;
    const removed = recipe.images.filter((image) => !kept.includes(image));
    const children = this.children(dto);

    await this.recipesRepository.manager.transaction(async (manager) => {
      const owner = { recipe: { id } };
      await manager.delete(Ingredients, owner);
      await manager.delete(Preparations, owner);
      await manager.delete(Hashtags, owner);
      if (removed.length > 0) {
        await manager.delete(Image, removed.map((image) => image.id));
      }

      recipe.title = dto.title.trim();
      recipe.description = dto.description.trim();
      recipe.category = category;
      recipe.ingredients = children.ingredients;
      recipe.preparations = children.preparations;
      recipe.hashtags = children.hashtags;
      recipe.images = [
        ...kept,
        ...files.map((file) =>
          Object.assign(new Image(), {
            url: `/uploads/recipes/${file.filename}`,
          }),
        ),
      ];
      recipe.images.forEach((image, position) => (image.position = position));
      await manager.save(recipe);
    });

    await Promise.all(removed.map((image) => removeUpload(image.url)));
    return this.getRecipe(id);
  }

  async deleteRecipe(id: string, user: User) {
    const recipe = await this.findOwned(id, user);
    await this.recipesRepository.remove(recipe);
    await Promise.all(recipe.images.map((image) => removeUpload(image.url)));
  }
}
