import { Controller, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './transaction.dto';

@Controller('transaction')
export class TransactionController {

    constructor(private transactionService: TransactionService) { }

    @Post()
    async createTransaction(@Body() body: CreateTransactionDto) {
        const transaction = await this.transactionService.createTransaction(body.fromId, body.toId, body.money, body.description);
        return { ...transaction, money: transaction.money.toString() };
    }

}