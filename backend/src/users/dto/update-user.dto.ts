import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class UpdateUserDto {

    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    token?: string;

    @IsString()
    @IsStrongPassword()
    @IsOptional()
    password?: string;
}
