import { Module } from "@nestjs/common";
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisCacheService } from "./redis-cache.service";
import * as redisStore from 'cache-manager-ioredis';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get("redisHost"),
                port: configService.get("redisPort"),
                ttl: configService.get('cacheTtl')
            })
        }),
    ],
    providers: [RedisCacheService],
    exports: [RedisCacheService],
})
export class RedisCacheModule { }
