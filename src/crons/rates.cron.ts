import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'

import { CurrencyService } from '../currencies/currency.service'
import { RatesService } from '../rates/rates.service'
import { formatLogMessage } from '../shared/helpers'
import { TelegramService } from '../telegram-bot/telegram.service'

@Injectable()
export class RatesCron implements OnApplicationBootstrap {
    private _isCronJobStarted = false

    constructor(
        private readonly _telegramService: TelegramService,
        private readonly _ratesService: RatesService,
        private readonly _currencyService: CurrencyService,
        private readonly _schedulerRegistry: SchedulerRegistry,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        this._telegramService.bindTelegramEvent('text', async (msg) => {
            if (msg.text === '/getrates') {
                const message = await this._createRatesMessage()

                this._telegramService.sendMessage({ text: message })
            }
        })

        const getRatesCronJob = new CronJob(
            CronExpression.EVERY_10_MINUTES,
            this.sendRatesToTelegram.bind(this),
        )

        this._schedulerRegistry.addCronJob(RatesCron.name, getRatesCronJob)

        getRatesCronJob.start()
    }

    async sendRatesToTelegram(): Promise<void> {
        try {
            if (this._isCronJobStarted) {
                return
            }

            const message = await this._createRatesMessage()

            this._telegramService.sendMessage({ text: message })
            this._isCronJobStarted = false
        } catch (error) {
            this._isCronJobStarted = false
        }
    }

    private async _createRatesMessage(): Promise<string> {
        const { code, name } = await this._currencyService.getBaseCurrency()
        const rates = await this._ratesService.getRates()
        const message = formatLogMessage({
            title: 'Rate',
            description: 'Actual rates',
            data: {
                baseCurrency: {
                    code,
                    name,
                },
                rates,
            },
        })

        return message
    }
}
