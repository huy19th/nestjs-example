import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { WalletModule } from './modules/wallet/wallet.module';
import { TransasctionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    WalletModule,
    TransasctionModule,
  ],
  providers: [],
})
export class AppModule { }