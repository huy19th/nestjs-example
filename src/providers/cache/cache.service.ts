import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {

    redis: Cache;

    constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
        this.redis = cacheManager;
    }

}