import {
    IsEmail,
    IsString,
    IsOptional,
    IsNotEmpty,
    MinLength,
    Matches,
    IsNumber,
    IsEnum
} from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/gm,
        { message: 'Password minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character' }
    )
    password!: string;

    @IsString()
    @IsOptional()
    @MinLength(3)
    username?: string;

}

export class LogInDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;
}

export class ForgotPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;
}