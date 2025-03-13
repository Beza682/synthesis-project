import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BigNumber } from 'bignumber.js'
import { In, Repository } from 'typeorm'

import { CurrencyService } from '../currencies/currency.service'
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../shared/constants'
import { getIdsWithoutUpdates } from '../shared/helpers'
import { encodePassword } from '../shared/utils/bcrypt'

import { UserEntity } from './entities'
import { UsersType, UserType } from './types'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly _userRepository: Repository<UserEntity>,
        private readonly _currencyService: CurrencyService,
    ) {}

    async create(createUser: {
        login: string
        password: string
        balance: BigNumber
        currency: { id: string }
    }): Promise<UserType> {
        const usersCount = await this._userRepository.count({
            where: { login: createUser.login },
        })

        if (usersCount !== 0) {
            throw new HttpException(
                `Wrong username or password`,
                HttpStatus.BAD_REQUEST,
            )
        }

        await this._currencyService.validateCurrency([createUser.currency.id])

        const password = await encodePassword(createUser.password)

        const users = await this._userRepository.save(
            this._userRepository.create({ ...createUser, password }),
        )

        const user = this._parseData(users)

        if (!user) {
            throw new HttpException(
                'The user was not created.',
                HttpStatus.BAD_REQUEST,
            )
        }

        return user
    }

    async find(findUsers: {
        currencyId?: string
        filter?: { limit?: number; offset?: number }
    }): Promise<UsersType> {
        const { currencyId, filter } = findUsers

        const limit = filter?.limit ? filter.limit : DEFAULT_LIMIT
        const offset = filter?.offset ? filter.offset : DEFAULT_OFFSET

        const cursor = limit + offset

        const [users, count] = await this._userRepository.findAndCount({
            where: {
                ...(currencyId && { currency: { id: currencyId } }),
            },
            relations: ['currency'],
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

    async findOne(id: string): Promise<UserType> {
        const user = await this._userRepository.findOne({
            where: { id },
            relations: ['currency'],
        })

        if (!user) {
            throw new HttpException(
                `The user by ID ${id} was not found.`,
                HttpStatus.NOT_FOUND,
            )
        }

        return this._parseData(user)
    }

    async update(updateUser: {
        id: string
        balance?: BigNumber
        currency?: { id: string }
    }): Promise<UserType> {
        const { id, currency } = updateUser

        const userIdsWithoutUpdates = getIdsWithoutUpdates([updateUser])

        if (userIdsWithoutUpdates.length) {
            throw new HttpException(
                `New data not provided for user ID: ${id}`,
                HttpStatus.BAD_REQUEST,
            )
        }

        if (currency) {
            await this._currencyService.validateCurrency([currency.id])
        }

        const usersCount = await this._userRepository.count({
            where: { id },
        })

        if (usersCount === 0) {
            throw new HttpException(
                `The user by ID ${id} was not found..`,
                HttpStatus.NOT_FOUND,
            )
        }

        await this._userRepository.save(updateUser)

        const updateUsers = await this.findOne(id)
        const user = updateUsers

        if (!user) {
            throw new HttpException(
                `The user was not updated.`,
                HttpStatus.BAD_REQUEST,
            )
        }

        return user
    }

    async remove(id: string): Promise<string> {
        const usersCount = await this._userRepository.count({
            where: { id },
        })

        if (usersCount !== 0) {
            throw new HttpException(
                `The user by ID ${id} was not found.`,
                HttpStatus.NOT_FOUND,
            )
        }

        const result = await this._userRepository.softDelete(id)

        if (result.affected !== usersCount) {
            throw new HttpException(
                `The user was not deleted.`,
                HttpStatus.BAD_REQUEST,
            )
        }

        return id
    }

    async validateUsers(userIds: string | string[]): Promise<void> {
        const isFewIds = Array.isArray(userIds)

        if (isFewIds && !userIds.length) {
            return
        }

        const uniqIds: Set<string> = new Set(userIds)
        const formattedIds = [...uniqIds.values()]

        const count = await this._userRepository.count({
            where: { id: In(formattedIds) },
        })

        if (formattedIds.length !== count) {
            throw new HttpException(
                `Related user not found.`,
                HttpStatus.BAD_REQUEST,
            )
        }
    }

    private _parseData(userEntity: UserEntity): UserType
    private _parseData(userEntity: UserEntity[]): UserType[]
    private _parseData(
        userEntity: UserEntity | UserEntity[],
    ): UserType | UserType[] {
        const isFewDtos = Array.isArray(userEntity)
        const entities = isFewDtos ? userEntity : [userEntity]

        const users: UserType[] = entities.map(
            ({ id, createdAt, updatedAt, login, currency, balance }) => ({
                id,
                createdAt,
                updatedAt,
                login,
                currencyId: currency.id,
                balance,
            }),
        )

        const [firstUser] = users

        return isFewDtos ? users : firstUser
    }
}
