import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { databaseOptions } from './database.config';
import { PostsModule } from './posts/posts.module';
import { RatingsModule } from './ratings/ratings.module';
import { RecipesModule } from './recipes/recipes.module';
import { UsersModule } from './users/users.module';

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET es obligatorio en producción');
  }
  return secret || 'dev-secret';
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseOptions()),
    // Se registra aquí, después de ConfigModule, para que lea JWT_SECRET del .env
    JwtModule.register({
      global: true,
      secret: jwtSecret(),
      signOptions: { expiresIn: '7d' },
    }),
    UsersModule,
    RecipesModule,
    CategoriesModule,
    CommentsModule,
    RatingsModule,
    PostsModule,
    AdminModule,
  ],
})
export class AppModule {}
