import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../jwt/guards/jwt-auth.guard'

import { CreateTransactionDto, FindTransactionsDto } from './dtos'
import { TransactionService } from './transaction.service'
import { TransactionsType, TransactionType } from './types'

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
    constructor(private readonly _transactionService: TransactionService) {}

    @Post('create')
    async create(
        @Body() createTransactionDto: CreateTransactionDto,
    ): Promise<TransactionType> {
        const response = await this._transactionService.create(
            createTransactionDto,
        )

        return response
    }

    @Get('find')
    async find(
        @Body() findTransactionsDto: FindTransactionsDto,
    ): Promise<TransactionsType> {
        const response = await this._transactionService.find(
            findTransactionsDto,
        )

        return response
    }

    @Get('find/:id')
    async findOne(@Param('id') id: string): Promise<TransactionType> {
        const response = await this._transactionService.findOne(id)

        return response
    }
}
