import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as TelegramBot from 'node-telegram-bot-api'

@Injectable()
export class TelegramService {
    private readonly _chatId: number
    private readonly _telegramToken: string

    private readonly _telegramBot: TelegramBot

    constructor(private readonly _configService: ConfigService) {
        this._chatId = this._configService.get<number>(
            `TELEGRAM_NOTIFICATION_CHAT`,
        )

        this._telegramToken =
            this._configService.get<string>(`TELEGRAM_TOKEN_BOT`)

        this._telegramBot = new TelegramBot(this._telegramToken, {
            polling: true,
        })
    }

    bindTelegramEvent(
        event: string,
        listener: (...args: any[]) => unknown,
    ): void {
        this._telegramBot.on(event, listener)
    }

    sendMessage(
        message: {
            chatId?: number
            text: string
        },
        opts?: TelegramBot.SendMessageOptions,
    ): void {
        const { chatId, text } = message

        this._telegramBot.sendMessage(chatId ?? this._chatId, text, {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            parse_mode: 'HTML',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            disable_web_page_preview: true,
            ...opts,
        })
    }

    sendPhoto(
        photo: {
            chatId?: number
            file: { buffer: Buffer; filename: string; contentType: string }
        },
        opts?: TelegramBot.SendPhotoOptions,
    ): void {
        const {
            chatId,
            file: { buffer, ...fileOptions },
        } = photo

        this._telegramBot.sendPhoto(
            chatId ?? this._chatId,
            buffer,
            opts,
            fileOptions,
        )
    }
}
