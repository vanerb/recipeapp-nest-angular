import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

// Las listas llegan como JSON porque el formulario es multipart
export const parseJson = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @Transform(parseJson)
  @IsArray()
  @ArrayMinSize(1, { message: 'Añade al menos un ingrediente' })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(255, { each: true })
  ingredients: string[];

  @Transform(parseJson)
  @IsArray()
  @ArrayMinSize(1, { message: 'Añade al menos un paso' })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(255, { each: true })
  preparations: string[];

  @Transform(parseJson)
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  @IsOptional()
  hashtags?: string[];
}
