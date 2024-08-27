import { forwardRef, Module } from '@nestjs/common'

import { RatesModule } from '../rates/rates.module'

import { TelegramController } from './telegram.controller'
import { TelegramService } from './telegram.service'

@Module({
    imports: [forwardRef(() => RatesModule)],
    controllers: [TelegramController],
    providers: [TelegramService],
    exports: [TelegramService],
})
export class TelegramModule {}
