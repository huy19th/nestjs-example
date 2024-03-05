import { IsNotEmpty, IsEmail, IsOptional, Length, IsString, IsEnum, IsNumber } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';

export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @Length(3, 20)
    username?: string;

    @IsString()
    @Length(3, 20)
    password: string;

}

export class UpdateUserDto extends PickType(CreateUserDto, ['email', 'username'] as const) { }