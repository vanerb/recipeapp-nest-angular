import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword(undefined, {
    message:
      'La contraseña necesita 8 caracteres con mayúscula, minúscula, número y símbolo',
  })
  password: string;
}
