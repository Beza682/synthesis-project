import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { CurrencyModule } from '../currencies/currency.module'
import { RedisModule } from '../redis'

import { RatesController } from './rates.controller'
import { RatesService } from './rates.service'

@Module({
    imports: [
        HttpModule,
        RedisModule,
        CurrencyModule,
    ],
    controllers: [RatesController],
    providers: [RatesService],
    exports: [RatesService],
})
export class RatesModule {}
