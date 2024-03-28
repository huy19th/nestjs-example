import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { WalletModule } from '../wallet/wallet.module';
import { PrismaModule } from 'src/providers/prisma/prisma.module';

@Module({
    imports: [
        WalletModule,
        PrismaModule,
    ],
    controllers: [TransactionController],
    providers: [TransactionService]
})
export class TransasctionModule { }