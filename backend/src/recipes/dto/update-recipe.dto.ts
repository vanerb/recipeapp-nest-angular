import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class UpdateRecipeDto {

    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    recipeDescription: string;

    @IsString()
    @IsOptional()
    hashtags: string;

    @IsString()
    @IsOptional()
    userId: string;

    @IsString()
    @IsOptional()
    categoryId: string;
}
