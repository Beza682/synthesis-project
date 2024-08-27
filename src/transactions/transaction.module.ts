import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RatesModule } from '../rates/rates.module'
import { UserModule } from '../users/user.module'

import { TransactionEntity } from './entities'
import { TransactionController } from './transaction.controller'
import { TransactionService } from './transaction.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionEntity]),
        UserModule,
        RatesModule,
    ],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService],
})
export class TransactionModule {}
