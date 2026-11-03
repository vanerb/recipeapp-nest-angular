import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  currentPassword?: string;

  @IsStrongPassword(undefined, {
    message:
      'La contraseña necesita 8 caracteres con mayúscula, minúscula, número y símbolo',
  })
  @IsOptional()
  password?: string;
}
