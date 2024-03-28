import {
    IsString,
    IsNumber,
    IsNotEmpty,
    IsOptional,
    IsInt,
    Min,
} from 'class-validator';

export class CreateTransactionDto {

    @IsString()
    @IsNotEmpty()
    fromId: string;

    @IsString()
    @IsNotEmpty()
    toId: string;

    @IsNumber()
    @IsInt()
    @Min(1000)
    @IsNotEmpty()
    money: number;

    @IsString()
    @IsOptional()
    description: string;

}