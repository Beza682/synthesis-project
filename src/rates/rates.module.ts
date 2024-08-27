import { HttpModule } from '@nestjs/axios'
import { forwardRef, Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { CurrencyModule } from '../currencies/currency.module'
import { RedisModule } from '../redis'
import { TelegramModule } from '../telegram-bot/telegram.module'

import { RatesController } from './rates.controller'
import { RatesService } from './rates.service'

@Module({
    imports: [
        ScheduleModule.forRoot(),
        HttpModule,
        forwardRef(() => TelegramModule),
        RedisModule,
        CurrencyModule,
    ],
    controllers: [RatesController],
    providers: [RatesService],
    exports: [RatesService],
})
export class RatesModule {}
