import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { arrayToFormatString, getIdsWithoutUpdates } from '../shared/helpers'

import { CreateCurrencyDto, UpdateCurrencyDto } from './dtos'
import { CurrencyEntity } from './entities'
import { CurrencyType } from './types'

@Injectable()
export class CurrencyService {
    constructor(
        @InjectRepository(CurrencyEntity)
        private readonly _currencyRepository: Repository<CurrencyEntity>,
    ) {}

    async create(createCurrencyDto: CreateCurrencyDto): Promise<CurrencyType>
    async create(
        createCurrencyDto: CreateCurrencyDto[],
    ): Promise<CurrencyType[]>
    async create(
        createCurrencyDto: CreateCurrencyDto | CreateCurrencyDto[],
    ): Promise<CurrencyType | CurrencyType[]> {
        const isFewDtos = Array.isArray(createCurrencyDto)
        const dtos = isFewDtos ? createCurrencyDto : [createCurrencyDto]

        const currenciesCount = await this._currencyRepository.count({
            where: { code: In(dtos.map(({ code }) => code)) },
        })

        if (currenciesCount > 0) {
            throw new HttpException(
                'The currency already exists.',
                HttpStatus.BAD_REQUEST,
            )
        }

        const currencies = await this._currencyRepository.save(
            dtos.map((dto) => this._currencyRepository.create(dto)),
        )

        if (!currencies?.length) {
            throw new HttpException(
                'The currency was not created.',
                HttpStatus.BAD_REQUEST,
            )
        }

        return this._parseData(currencies)
    }

    async find(ids?: string[]): Promise<CurrencyType[]> {
        const currencies = await this._currencyRepository.find({
            where: {
                ...(ids?.length && { id: In(ids) }),
            },
        })

        return this._parseData(currencies)
    }

    async getCurrenciesIds(): Promise<string[]> {
        return (await this._currencyRepository.find()).map(({ id }) => id)
    }

    async findOne(id: string): Promise<CurrencyType> {
        const currency = await this._currencyRepository.findOneBy({ id })

        if (!currency) {
            throw new HttpException(
                `The currency by ID ${id} was not found.`,
                HttpStatus.NOT_FOUND,
            )
        }

        return this._parseData(currency)
    }

    async update(updateCurrencyDto: UpdateCurrencyDto): Promise<CurrencyType>
    async update(
        updateCurrencyDto: UpdateCurrencyDto[],
    ): Promise<CurrencyType[]>
    async update(
        updateCurrencyDto: UpdateCurrencyDto | UpdateCurrencyDto[],
    ): Promise<CurrencyType | CurrencyType[]> {
        const isFewDtos = Array.isArray(updateCurrencyDto)
        const dtos = isFewDtos ? updateCurrencyDto : [updateCurrencyDto]

        const currencyIds = dtos.map(({ id }) => id)

        const currencyIdsWithoutUpdates = getIdsWithoutUpdates(dtos)

        if (currencyIdsWithoutUpdates.length) {
            throw new HttpException(
                `New data not provided for currencies: ` +
                    `${arrayToFormatString(currencyIdsWithoutUpdates)}.`,
                HttpStatus.BAD_REQUEST,
            )
        }

        const currenciesCount = await this._currencyRepository.count({
            where: { id: In(currencyIds) },
        })

        if (currenciesCount !== currencyIds.length) {
            throw new HttpException(
                `Not all currencies were found. ` +
                    `Requested currency IDs: ${arrayToFormatString(
                        currencyIds,
                    )}.`,
                HttpStatus.NOT_FOUND,
            )
        }

        await this._currencyRepository.save(dtos)

        const updatedCurrencies = await this.find(currencyIds)
        const [firstCurrency] = updatedCurrencies

        if (!firstCurrency) {
            throw new HttpException(
                `The currency was not updated.`,
                HttpStatus.BAD_REQUEST,
            )
        }

        return isFewDtos ? updatedCurrencies : firstCurrency
    }

    async remove(id: string): Promise<string>
    async remove(id: string[]): Promise<string[]>
    async remove(id: string | string[]): Promise<string | string[]> {
        const isFewIds = Array.isArray(id)
        const currencyIds = isFewIds ? id : [id]

        const currenciesCount = await this._currencyRepository.count({
            where: { id: In(currencyIds) },
        })

        if (currenciesCount !== currencyIds.length) {
            throw new HttpException(
                `Not all currencies were found. ` +
                    `Requested currency IDs: ${arrayToFormatString(
                        currencyIds,
                    )}.`,
                HttpStatus.NOT_FOUND,
            )
        }

        const result = await this._currencyRepository.softDelete(currencyIds)

        if (result.affected !== currenciesCount) {
            throw new HttpException(
                `The currency was not deleted.`,
                HttpStatus.BAD_REQUEST,
            )
        }

        return id
    }

    async validateCurrency(currencyIds: string | string[]): Promise<void> {
        const isFewIds = Array.isArray(currencyIds)

        if (isFewIds && !currencyIds.length) {
            return
        }

        const uniqIds: Set<string> = new Set(currencyIds)
        const formattedIds = [...uniqIds.values()]

        const count = await this._currencyRepository.count({
            where: { id: In(formattedIds) },
        })

        if (formattedIds.length !== count) {
            throw new HttpException(
                `Related currency not found.`,
                HttpStatus.BAD_REQUEST,
            )
        }
    }

    private _parseData(currencyEntity: CurrencyEntity): CurrencyType
    private _parseData(currencyEntity: CurrencyEntity[]): CurrencyType[]
    private _parseData(
        currencyEntity: CurrencyEntity | CurrencyEntity[],
    ): CurrencyType | CurrencyType[] {
        const isFewDtos = Array.isArray(currencyEntity)
        const entities = isFewDtos ? currencyEntity : [currencyEntity]

        const currencies: CurrencyType[] = entities.map(
            ({ id, createdAt, updatedAt, name, code }) => ({
                id,
                createdAt,
                updatedAt,
                name,
                code,
            }),
        )

        const [firstCurrency] = currencies

        return isFewDtos ? currencies : firstCurrency
    }
}
