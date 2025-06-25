import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, IsUUID } from 'class-validator';
import { CreateHashtagDto } from 'src/hashtags/dto/create-hashtag.dto';
import { Hashtags } from 'src/hashtags/hashtags.entity';
import { CreateIngredientDto } from 'src/ingredients/dto/create-ingredient.dto';
import { Ingredients } from 'src/ingredients/ingredients.entity';
import { CreatePreaparationDto } from 'src/preparations/dto/create-preparation.dto';
import { Preparations } from 'src/preparations/preparations.entity';

export class UpdateRecipeDto {

    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
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
    @IsOptional()
    userId: string;

    @IsString()
    @IsOptional()
    categoryId: string;
}
