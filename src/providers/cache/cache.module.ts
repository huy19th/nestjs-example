import { Module } from '@nestjs/common';
import { CacheModule as CacheManager } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { RedisConfigService } from 'src/config/redis.config';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [CacheManager.registerAsync({ useClass: RedisConfigService, imports: [ConfigModule] })],
    providers: [CacheService],
    exports: [CacheService],
})
export class CacheModule { }