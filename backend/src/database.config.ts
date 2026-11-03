import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Category } from './categories/categories.entity';
import { Comment } from './comments/comments.entity';
import { Hashtags } from './hashtags/hashtags.entity';
import { Image } from './images/images.entity';
import { Ingredients } from './ingredients/ingredients.entity';
import { Post } from './posts/posts.entity';
import { Preparations } from './preparations/preparations.entity';
import { Rating } from './ratings/ratings.entity';
import { Recipe } from './recipes/recipes.entity';
import { User } from './users/users.entity';

const entities = [
  User,
  Recipe,
  Category,
  Image,
  Preparations,
  Ingredients,
  Hashtags,
  Comment,
  Rating,
  Post,
];

// Con DB_HOST usa MySQL; sin él arranca con un fichero SQLite, sin instalar nada
export function databaseOptions(): TypeOrmModuleOptions {
  const synchronize = process.env.DB_SYNC !== 'false';
  const type = process.env.DB_TYPE ?? (process.env.DB_HOST ? 'mysql' : 'sqljs');

  if (type === 'sqljs') {
    const location = process.env.DB_LOCATION ?? 'data/recipes.sqlite';
    if (location === ':memory:') {
      return { type: 'sqljs', entities, synchronize };
    }
    mkdirSync(dirname(location), { recursive: true });
    return { type: 'sqljs', location, autoSave: true, entities, synchronize };
  }

  return {
    type: 'mysql',
    connectorPackage: 'mysql2',
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || 3306),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities,
    synchronize,
  };
}
