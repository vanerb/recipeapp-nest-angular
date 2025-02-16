import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  recipeDescription: string;

  @IsString()
  @IsNotEmpty()
  hashtags: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
