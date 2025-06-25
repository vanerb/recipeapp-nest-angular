import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, IsUUID } from 'class-validator';
import { Hashtags } from 'src/hashtags/hashtags.entity';
import { Ingredients } from 'src/ingredients/ingredients.entity';
import { Preparations } from 'src/preparations/preparations.entity';

export class UpdatePreparationDto {

    @IsString()
    @IsOptional()
    preparation: string;
}
