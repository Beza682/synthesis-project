import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common'

import { JwtAuthGuard } from '../jwt/guards/jwt-auth.guard'

import { CreateTransactionDto, FindTransactionsDto } from './dtos'
import { TransactionService } from './transaction.service'
import { TransactionsType, TransactionType } from './types'

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
    constructor(private readonly _transactionService: TransactionService) {}

    @Post()
    async create(
        @Body() createTransactionDto: CreateTransactionDto,
    ): Promise<TransactionType> {
        const response = await this._transactionService.create(
            createTransactionDto,
        )

        return response
    }

    @Get()
    async find(
        @Query() findTransactionsDto: FindTransactionsDto,
    ): Promise<TransactionsType> {
        const response = await this._transactionService.find(
            findTransactionsDto,
        )

        return response
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<TransactionType> {
        const response = await this._transactionService.findOne(id)

        return response
    }
}
