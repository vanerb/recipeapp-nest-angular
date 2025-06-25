import { IsArray, IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsUUID } from 'class-validator';
import { Hashtags } from 'src/hashtags/hashtags.entity';
import { Ingredients } from 'src/ingredients/ingredients.entity';
import { Preparations } from 'src/preparations/preparations.entity';

export class CreatePreaparationDto {
  @IsString()
  @IsNotEmpty()
  preparation: string;
}
