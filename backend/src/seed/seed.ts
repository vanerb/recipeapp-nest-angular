import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { AppModule } from 'src/app.module';
import { Category } from 'src/categories/categories.entity';
import { Comment } from 'src/comments/comments.entity';
import { Hashtags } from 'src/hashtags/hashtags.entity';
import { Image } from 'src/images/images.entity';
import { Ingredients } from 'src/ingredients/ingredients.entity';
import { Post } from 'src/posts/posts.entity';
import { Preparations } from 'src/preparations/preparations.entity';
import { Rating } from 'src/ratings/ratings.entity';
import { Recipe } from 'src/recipes/recipes.entity';
import { User } from 'src/users/users.entity';

// Los datos son los mismos que usa la demo estática del frontend
const SEED_FILE = join(
  process.cwd(),
  '..',
  'frontend',
  'src',
  'assets',
  'demo',
  'seed.json',
);

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000);

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error'],
  });
  const db = app.get(DataSource);
  const data = JSON.parse(readFileSync(SEED_FILE, 'utf8'));
  const reset = process.argv.includes('--reset');

  if ((await db.getRepository(User).count()) > 0 && !reset) {
    console.log('La base de datos ya tiene usuarios. Usa --reset para vaciarla.');
    await app.close();
    return;
  }

  if (reset) {
    // Por orden, para respetar las claves foráneas
    for (const entity of [Post, Rating, Comment, Recipe, Category, User]) {
      await db.getRepository(entity).createQueryBuilder().delete().execute();
    }
  }

  const password = await bcrypt.hash(data.password, 10);
  const users = new Map<string, User>();
  for (const item of data.users) {
    const user = await db.getRepository(User).save(
      db.getRepository(User).create({
        name: item.name,
        email: item.email,
        bio: item.bio,
        avatar: item.avatar ?? null,
        role: item.role ?? 'user',
        password,
      }),
    );
    users.set(item.key, user);
  }

  const categories = new Map<string, Category>();
  for (const item of data.categories) {
    const category = await db.getRepository(Category).save(
      db.getRepository(Category).create({
        name: item.name,
        user: users.get(item.owner),
      }),
    );
    categories.set(item.key, category);
  }

  const recipes = new Map<string, Recipe>();
  for (const item of data.recipes) {
    const recipe = await db.getRepository(Recipe).save(
      db.getRepository(Recipe).create({
        title: item.title,
        description: item.description,
        user: users.get(item.user),
        category: categories.get(item.category),
        createdAt: hoursAgo(item.hoursAgo),
        images: item.images.map((url: string, position: number) =>
          Object.assign(new Image(), { url, position }),
        ),
        ingredients: item.ingredients.map(
          (ingredient: string, position: number) =>
            Object.assign(new Ingredients(), { ingredient, position }),
        ),
        preparations: item.steps.map((preparation: string, position: number) =>
          Object.assign(new Preparations(), { preparation, position }),
        ),
        hashtags: item.hashtags.map((hashtag: string) =>
          Object.assign(new Hashtags(), { hashtag }),
        ),
      }),
    );
    recipes.set(item.key, recipe);
  }

  await db.getRepository(Rating).save(
    data.ratings.map((item) =>
      db.getRepository(Rating).create({
        value: item.value,
        recipeId: recipes.get(item.recipe)!.id,
        userId: users.get(item.user)!.id,
      }),
    ),
  );

  await db.getRepository(Comment).save(
    data.comments.map((item) =>
      db.getRepository(Comment).create({
        text: item.text,
        recipeId: recipes.get(item.recipe)!.id,
        user: users.get(item.user),
        createdAt: hoursAgo(item.hoursAgo),
      }),
    ),
  );

  await db.getRepository(Post).save(
    data.posts.map((item) =>
      db.getRepository(Post).create({
        caption: item.caption,
        image: item.image,
        user: users.get(item.user),
        recipe: recipes.get(item.recipe),
        createdAt: hoursAgo(item.hoursAgo),
      }),
    ),
  );

  console.log(
    `Listo: ${users.size} usuarios, ${recipes.size} recetas y ${data.posts.length} publicaciones.`,
  );
  await app.close();
}

seed();
