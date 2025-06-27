import { IsArray, IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsUUID } from 'class-validator';
import { Hashtags } from 'src/hashtags/hashtags.entity';
import { Ingredients } from 'src/ingredients/ingredients.entity';
import { Preparations } from 'src/preparations/preparations.entity';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  hashtags: Hashtags[];

  @IsArray()
  @IsNotEmpty()
  ingredients: Ingredients[];

  @IsArray()
  @IsNotEmpty()
  preparations: Preparations[];

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
