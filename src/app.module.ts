import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongo.config';
import { ThrottlerConfigService } from './config/throttler.config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from './providers/cache/cache.module';
import { EmailModule } from './providers/email/email.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { TokenModule } from './providers/token/token.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    MongooseModule.forRootAsync({ useClass: MongooseConfigService, imports: [ConfigModule] }),
    ThrottlerModule.forRootAsync({ useClass: ThrottlerConfigService, imports: [ConfigModule] }),
    CacheModule,
    EmailModule,
    UserModule,
    AuthModule,
    TokenModule,
    UploadModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule { }