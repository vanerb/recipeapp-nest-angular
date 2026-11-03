import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  caption: string;

  @IsString()
  @IsNotEmpty()
  recipeId: string;
}
