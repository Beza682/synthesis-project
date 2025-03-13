import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { CurrencyModule } from '../currencies/currency.module'
import { RatesModule } from '../rates/rates.module'
import { TelegramModule } from '../telegram-bot/telegram.module'

import { RatesCron } from './rates.cron'

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TelegramModule,
        RatesModule,
        CurrencyModule,
    ],
    providers: [RatesCron],
})
export class CronModule {}
