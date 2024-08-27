import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BigNumber } from 'bignumber.js'
import { Repository } from 'typeorm'

import { RatesService } from '../rates/rates.service'
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../shared/constants'
import { UserService } from '../users/user.service'

import { CreateTransactionDto, FindTransactionsDto } from './dtos'
import { TransactionEntity } from './entities'
import { TransactionsType, TransactionType } from './types'

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly _transactionRepository: Repository<TransactionEntity>,
        private readonly _userService: UserService,
        private readonly _ratesService: RatesService,
    ) {}

    async create(
        createTransactionDto: CreateTransactionDto,
    ): Promise<TransactionType> {
        const { amount, from, to } = createTransactionDto

        const sender = await this._userService.findOne(from.id )
        const recipient = await this._userService.findOne(to.id)

        const coef =
            sender.currencyId !== recipient.currencyId
                ? await this._ratesService.getConvertCoefficient(
                      sender.currencyId,
                      recipient.currencyId,
                  )
                : new BigNumber('1')

        const totalAmount = sender.balance.minus(amount.multipliedBy(coef))
        const canCreateTransaction = totalAmount.isGreaterThanOrEqualTo(
            new BigNumber(0),
        )

        if (!canCreateTransaction) {
            throw new HttpException(
                'Insufficient balance to complete the transaction.',
                HttpStatus.BAD_REQUEST,
            )
        }

        const transactions = await this._transactionRepository.save(
            this._transactionRepository.create({
                ...createTransactionDto,
                amount: totalAmount,
            }),
        )

        await this._userService.update({
            id: sender.id,
            balance: sender.balance.minus(totalAmount),
        })

        await this._userService.update({
            id: recipient.id,
            balance: recipient.balance.plus(totalAmount),
        })

        const transaction = this._parseData(transactions)

        if (!transaction) {
            throw new HttpException(
                'The transaction was not created.',
                HttpStatus.BAD_REQUEST,
            )
        }

        return transaction
    }

    async find(findUserDto: FindTransactionsDto): Promise<TransactionsType> {
        const { fromId, toId, filter } = findUserDto

        const limit = filter?.limit ? filter.limit : DEFAULT_LIMIT
        const offset = filter?.offset ? filter.offset : DEFAULT_OFFSET

        const cursor = limit + offset

        const [users, count] = await this._transactionRepository.findAndCount({
            where: {
                ...(fromId && { from: { id: fromId } }),
                ...(toId && { to: { id: toId } }),
            },
            relations: ['from', 'to'],
            order: { updatedAt: 'DESC' },
            take: limit,
            skip: offset,
        })

        return {
            data: this._parseData(users),
            cursor,
            count,
        }
    }

    async findOne(id: string): Promise<TransactionType> {
        const transaction = await this._transactionRepository.findOne({
            where: { id },
            relations: ['from', 'to'],
        })

        if (!transaction) {
            throw new HttpException(
                `The transaction by ID ${id} was not found.`,
                HttpStatus.NOT_FOUND,
            )
        }

        return this._parseData(transaction)
    }

    private _parseData(transactionEntity: TransactionEntity): TransactionType
    private _parseData(
        transactionEntity: TransactionEntity[],
    ): TransactionType[]
    private _parseData(
        transactionEntity: TransactionEntity | TransactionEntity[],
    ): TransactionType | TransactionType[] {
        const isFewDtos = Array.isArray(transactionEntity)
        const entities = isFewDtos ? transactionEntity : [transactionEntity]

        const transactions: TransactionType[] = entities.map(
            ({ id, createdAt, updatedAt, from, to, amount }) => ({
                id,
                createdAt,
                updatedAt,
                fromId: from.id,
                toId: to.id,
                amount,
            }),
        )

        const [firstTransaction] = transactions

        return isFewDtos ? transactions : firstTransaction
    }
}
