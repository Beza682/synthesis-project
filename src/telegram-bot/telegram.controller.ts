import { Readable } from 'stream'

import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { JwtAuthGuard } from '../jwt/guards/jwt-auth.guard'

import { TelegramService } from './telegram.service'


@UseGuards(JwtAuthGuard)
@Controller('telegram')
export class TelegramController {
    constructor(private readonly _telegramService: TelegramService) {}

    @Post('send-message')
    sendMessage(
        @Body('message') message: string,
    ): void {
        this._telegramService.sendMessage({
            text: message,
        })
    }

    @Post('send-photo')
    @UseInterceptors(FileInterceptor('file'))
    sendPhoto(
        @UploadedFile()
        file: {
            fieldname: string
            originalname: string
            encoding: string
            mimetype: string
            size: number
            stream: Readable
            destination: string
            filename: string
            path: string
            buffer: Buffer
        }
    ): void {
        this._telegramService.sendPhoto({
            file: {
                buffer: file.buffer,
                filename: file.originalname,
                contentType: file.mimetype,
            },
        })
    }
}
