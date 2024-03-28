import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { Transaction } from '@prisma/client';
import { WalletService } from '../wallet/wallet.service';
import { Wallet } from '@prisma/client';

@Injectable()
export class TransactionService {

    private transaction: PrismaService['transaction'];

    constructor(
        private prismaService: PrismaService,
        private walletService: WalletService,
    ) {
        this.transaction = this.prismaService.transaction;
    }

    getTransaction(id: string): Promise<Transaction> {
        return this.transaction.findFirst({ where: { id } });
    }

    createTransaction(fromId: string, toId: string, money: number, description: string = ''): Promise<Transaction> {
        return this.prismaService.$transaction(async () => {
            const fromWallet = await this.walletService.adjustBalance(fromId, -money);
            if (!fromWallet) throw new NotFoundException({ message: `Sender's wallet not found` });
            if (fromWallet.balance < 0) throw new BadRequestException({ message: 'Insufficient funds' });
            const toWallet = await this.walletService.adjustBalance(toId, money);
            if (!toWallet) throw new NotFoundException({ message: `Receiver's wallet not found` });
            const transaction = await this.transaction.create({ data: { fromId, toId, money, description } });
            return transaction;
        });
    }

}