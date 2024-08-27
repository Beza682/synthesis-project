import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from './auth/auth.module'
import { config } from './config/config'
import { typeormConfig } from './config/typeorm.config'
import { CurrencyModule } from './currencies/currency.module'
import { RatesModule } from './rates/rates.module'
import { AllExceptionsFilter } from './shared/exceptions'
import { TelegramModule } from './telegram-bot/telegram.module'
import { TransactionModule } from './transactions/transaction.module'
import { UserModule } from './users/user.module'

@Module({
    imports: [
        ConfigModule.forRoot(config),
        TypeOrmModule.forRootAsync(typeormConfig),
        CurrencyModule,
        UserModule,
        TransactionModule,
        RatesModule,
        TelegramModule,
        AuthModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule {}
