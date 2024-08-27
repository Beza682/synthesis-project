import { Body, Controller, Post, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../jwt/guards/jwt-auth.guard'

import { TelegramService } from './telegram.service'

@UseGuards(JwtAuthGuard)
@Controller('telegram')
export class TelegramController {
    constructor(private readonly _telegramService: TelegramService) {}

    @Post('test')
    test(@Body('message') message: string): void {
        this._telegramService.sendMessage(message)
    }
}
