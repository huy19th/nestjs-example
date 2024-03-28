import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { Prisma, Wallet } from '@prisma/client';

@Injectable()
export class WalletService {

    private wallet: PrismaService['wallet'];

    constructor(private prismaService: PrismaService) {
        this.wallet = this.prismaService.wallet;
    }

    getAllWallets(): Promise<Wallet[]> {
        return this.wallet.findMany();
    }

    getWallet(id: string): Promise<Wallet> {
        return this.wallet.findFirstOrThrow({ where: { id } });
    }

    createWallet(balance: number): Promise<Wallet> {
        return this.wallet.create({ data: { balance } });
    }

    async deleteWallet(id: string): Promise<void> {
        try {
            await this.wallet.delete({ where: { id } });
        }
        catch (err) {
            console.log(err);
            throw new BadRequestException({ message: 'Wallet not found' });
        }
    }

    async adjustBalance(id: string, balance: number): Promise<Wallet> {
        try {
            return await this.wallet.update({
                where: { id },
                data: {
                    balance: {
                        increment: balance
                    }
                }
            });
        }
        catch (err) {
            console.log(err.message);
            return null;
        }
    }

    createTransaction(fromId: string, toId: string, money: number): Promise<Wallet[]> {
        return this.prismaService.$transaction(
            async () => {
                const fromWallet = await this.adjustBalance(fromId, -money);
                if (!fromWallet) throw new NotFoundException({ message: `Sender's wallet not found` });
                if (fromWallet.balance < 0) throw new BadRequestException({ message: 'Insufficient funds' });
                const toWallet = await this.adjustBalance(toId, money);
                if (!toWallet) throw new NotFoundException({ message: `Receiver's wallet not found` });
                return [fromWallet, toWallet];
            },
            {
                maxWait: 5000, // default: 2000
                timeout: 10000, // default: 5000
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
            }
        )
    }

}