/* eslint-disable @typescript-eslint/naming-convention */
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as TelegramBot from 'node-telegram-bot-api'

import { RatesService } from '../rates/rates.service'

@Injectable()
export class TelegramService {
    private readonly _chatId: number
    private readonly _telegramToken: string

    private readonly _telegramBot: TelegramBot

    constructor(
        @Inject(forwardRef(() => RatesService))
        private readonly _ratesService: RatesService,
        private readonly _configService: ConfigService,
    ) {
        this._chatId = this._configService.get<number>(
            `TELEGRAM_NOTIFICATION_CHAT`,
        )
        this._telegramToken =
            this._configService.get<string>(`TELEGRAM_TOKEN_BOT`)

        this._telegramBot = new TelegramBot(this._telegramToken, {
            polling: true,
        })

        this._telegramBot.on('text', (msg) => {
            if (msg.text === '/getrates') {
                this._ratesService.sendRatesToTelegram()
            }
        })
    }

    sendMessage(message: string, opts?: TelegramBot.SendMessageOptions): void {
        this._telegramBot.sendMessage(this._chatId, message, {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            parse_mode: 'HTML',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            disable_web_page_preview: true,
            ...opts,
        })
    }
}
