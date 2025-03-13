import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BigNumber } from 'bignumber.js'
import { Repository } from 'typeorm'

import { RatesService } from '../rates/rates.service'
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../shared/constants'
import { UserService } from '../users/user.service'

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

    async create(createTransactionDto: {
        amount: BigNumber
        from: { id: string }
        to: { id: string }
    }): Promise<TransactionType> {
        const { amount, from, to } = createTransactionDto

        const queryRunner =
            this._transactionRepository.manager.connection.createQueryRunner()
        await queryRunner.startTransaction()
        const { manager: queryManager } = queryRunner

        try {
            const sender = await this._userService.findOne(
                from.id,
                queryManager,
            )
            const recipient = await this._userService.findOne(
                to.id,
                queryManager,
            )

            const coef =
                sender.currencyId !== recipient.currencyId
                    ? await this._ratesService.getConvertCoefficient(
                          sender.currencyId,
                          recipient.currencyId,
                      )
                    : new BigNumber('1')

            const transactionAmount = amount.multipliedBy(coef)
            const totalAmount = sender.balance.minus(transactionAmount)

            const canCreateTransaction = totalAmount.isGreaterThanOrEqualTo(
                new BigNumber(0),
            )

            if (!canCreateTransaction) {
                throw new HttpException(
                    'Insufficient balance to complete the transaction.',
                    HttpStatus.BAD_REQUEST,
                )
            }

            const transactions = await queryManager.save(
                this._transactionRepository.create({
                    ...createTransactionDto,
                    amount: transactionAmount,
                }),
            )

            await this._userService.update(
                {
                    id: sender.id,
                    balance: sender.balance.minus(transactionAmount),
                },
                queryManager,
            )

            await this._userService.update(
                {
                    id: recipient.id,
                    balance: recipient.balance.plus(amount),
                },
                queryManager,
            )

            const transaction = this._parseData(transactions)

            if (!transaction) {
                throw new HttpException(
                    'The transaction was not created.',
                    HttpStatus.BAD_REQUEST,
                )
            }

            await queryRunner.commitTransaction()

            return transaction
        } catch (error) {
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            await queryRunner.release()
        }
    }

    async find(findUser: {
        fromId?: string
        toId?: string
        filter?: { limit?: number; offset?: number }
    }): Promise<TransactionsType> {
        const { fromId, toId, filter } = findUser

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
