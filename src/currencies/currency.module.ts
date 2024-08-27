import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CurrencyController } from './currency.controller'
import { CurrencyService } from './currency.service'
import { CurrencyEntity } from './entities'

@Module({
    imports: [TypeOrmModule.forFeature([CurrencyEntity])],
    controllers: [CurrencyController],
    providers: [CurrencyService],
    exports: [CurrencyService],
})
export class CurrencyModule {}
