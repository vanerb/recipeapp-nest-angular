import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateRecipeDto, parseJson } from './create-recipe.dto';

export class UpdateRecipeDto extends CreateRecipeDto {
  // Imágenes existentes que se conservan; el resto se borran
  @Transform(parseJson)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keepImageIds?: string[];
}
