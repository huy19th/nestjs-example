import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateWalletDto {

    @IsNotEmpty()
    @IsNumber()
    @Min(1000, { message: 'The minimum amount is 1000' })
    balance: number;

}

export class AdjustBalanceDto extends CreateWalletDto { }