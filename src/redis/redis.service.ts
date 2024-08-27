import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

const DEFAULT_REDIS_HOST = 'localhost'
const DEFAULT_REDIS_PORT = 6379

@Injectable()
export class RedisService implements OnModuleInit {
    private _redisClient: Redis

    get redisClient(): Redis {
        return this._redisClient
    }

    constructor(private readonly _configService: ConfigService) {}

    async onModuleInit(): Promise<void> {
        const host = this._configService.get<string>(
            'REDIS_HOST',
            DEFAULT_REDIS_HOST,
        )
        const port = this._configService.get<number>(
            'REDIS_PORT',
            DEFAULT_REDIS_PORT,
        )

        this._redisClient = new Redis({ host, port })
    }
}
