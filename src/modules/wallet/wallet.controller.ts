import { Controller, Get, Post, Delete, Body, Patch, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';

// just for testing database interaction, not how api should be configured
@Controller('wallet')
export class WalletController {

    constructor(private walletService: WalletService) { }

    @Get('/all-wallets')
    async getAllWallets() {
        const wallets = await this.walletService.getAllWallets();
        return wallets.map(wallet => ({ ...wallet, balance: wallet.balance.toString() }));
    }

    @Get('/:id')
    async getWallet(@Param('id') id: string) {
        return await this.walletService.getWallet(id);
    }

    @Post()
    async createWallet(@Body('balance') balance: number) {
        const wallet = await this.walletService.createWallet(balance);
        return { ...wallet, balance: wallet.balance.toString() };
    }

    @Patch('/:id')
    async adjustBalance(
        @Param('id') id: string,
        @Body('balance') balance: number
    ) {
        const wallet = await this.walletService.adjustBalance(id, balance);
        return { ...wallet, balance: wallet.balance.toString() };
    }

    @Delete('/:id')
    async deleteWallet(@Param('id') id: string) {
        await this.walletService.deleteWallet(id);
    }

}