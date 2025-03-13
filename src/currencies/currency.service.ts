import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, In, Repository } from 'typeorm'

import { arrayToFormatString, getIdsWithoutUpdates } from '../shared/helpers'

import { CurrencyEntity } from './entities'
import { ICreateCurrency, IUpdateCurrency } from './interfaces'
import { CurrencyType } from './types'

@Injectable()
export class CurrencyService {
    private readonly _baseCurrency: string

    constructor(
        @InjectRepository(CurrencyEntity)
        private readonly _currencyRepository: Repository<CurrencyEntity>,
        private readonly _configService: ConfigService,
    ) {
        this._baseCurrency = this._configService.get<string>(
            `CURRENCYFREAKS_BASE_CURRENCY`,
        )
    }

    async create(createCurrency: ICreateCurrency): Promise<CurrencyType>
    async create(createCurrency: ICreateCurrency[]): Promise<CurrencyType[]>
    async create(
        createCurrency: ICreateCurrency | ICreateCurrency[],
    ): Promise<CurrencyType | CurrencyType[]> {
        const isFewDtos = Array.isArray(createCurrency)
        const dtos = isFewDtos ? createCurrency : [createCurrency]

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

    async findOne(
        filter: FindOptionsWhere<CurrencyEntity>,
    ): Promise<CurrencyType> {
        const currency = await this._currencyRepository.findOneBy(filter)

        if (!currency) {
            throw new HttpException(
                `The currency by filter ${filter} was not found.`,
                HttpStatus.NOT_FOUND,
            )
        }

        return this._parseData(currency)
    }

    async getBaseCurrency(): Promise<CurrencyType> {
        const currency = await this._currencyRepository.findOneBy({
            code: this._baseCurrency,
        })

        if (!currency) {
            throw new HttpException(
                `The currency base currency was not found.`,
                HttpStatus.NOT_FOUND,
            )
        }

        return this._parseData(currency)
    }

    async getCurrenciesIds(): Promise<string[]> {
        return (await this._currencyRepository.find()).map(({ id }) => id)
    }

    async update(updateCurrency: IUpdateCurrency): Promise<CurrencyType>
    async update(updateCurrency: IUpdateCurrency[]): Promise<CurrencyType[]>
    async update(
        updateCurrency: IUpdateCurrency | IUpdateCurrency[],
    ): Promise<CurrencyType | CurrencyType[]> {
        const isFewDtos = Array.isArray(updateCurrency)
        const dtos = isFewDtos ? updateCurrency : [updateCurrency]

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
