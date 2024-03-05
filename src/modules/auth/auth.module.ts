import { Module } from '@nestjs/common';
import { TokenModule } from 'src/providers/token/token.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { CacheModule } from 'src/providers/cache/cache.module';

@Module({
    imports: [
        ConfigModule,
        CacheModule,
        TokenModule,
        UserModule,
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule { }