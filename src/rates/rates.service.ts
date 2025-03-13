import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BigNumber } from 'bignumber.js'

import { CurrencyService } from '../currencies/currency.service'
import { RATES_PREFIX, RedisService } from '../redis'
import { DEFAULT_DECIMAL_PLACES } from '../shared/constants'
import { arrayToFormatString } from '../shared/helpers'

import { IRates } from './interfaces'
import { RateType } from './types'

@Injectable()
export class RatesService {
    private readonly _baseUrl: string
    private readonly _baseCurrency: string
    private readonly _apiKey: string

    private readonly _redisRatesTtl: number

    constructor(
        private readonly _httpService: HttpService,
        private readonly _configService: ConfigService,
        private readonly _redisService: RedisService,
        private readonly _currenciesService: CurrencyService,
    ) {
        this._apiKey = this._configService.get<string>(`CURRENCYFREAKS_APIKEY`)
        this._baseCurrency = this._configService.get<string>(
            `CURRENCYFREAKS_BASE_CURRENCY`,
        )
        this._baseUrl = this._configService.get<string>(
            `CURRENCYFREAKS_ENDPOINT`,
        )

        this._redisRatesTtl = this._configService.get<number>(`REDIS_RATES_TTL`)
    }

    async getConvertCoefficient(
        baseCurrencyId: string,
        quoteCurrencyId: string,
    ): Promise<BigNumber> {
        const [base, quote] = await this.getRates([
            baseCurrencyId,
            quoteCurrencyId,
        ])

        return base.code !== quote.code
            ? BigNumber(base.rate)
                  .div(BigNumber(quote.rate))
                  .decimalPlaces(DEFAULT_DECIMAL_PLACES, BigNumber.ROUND_DOWN)
            : new BigNumber(1)
    }

    async getRates(currencyIds?: string[]): Promise<RateType[]> {
        const ids = currencyIds?.length
            ? currencyIds
            : await this._currenciesService.getCurrenciesIds()

        let rates: RateType[] = []

        await Promise.all(
            ids.map(async (currencyId) => {
                const rate = await this._redisService.redisClient.get(
                    `${RATES_PREFIX}:${currencyId}`,
                )

                if (rate) {
                    rates.push(JSON.parse(rate) as RateType)
                }
            }),
        )

        if (rates?.length !== ids.length) {
            rates = await this._saveRates()
        }

        return rates
    }

    private async _saveRates(): Promise<RateType[]> {
        const currencies = await this._currenciesService.find()
        const codes = currencies.map(({ code }) => code)

        const rates: RateType[] = []

        const { data } = await this._httpService.axiosRef.request<IRates>({
            url: `rates/latest`,
            method: 'GET',
            baseURL: this._baseUrl,
            params: {
                symbols: arrayToFormatString(codes, true),
                base: this._baseCurrency,
                apikey: this._apiKey,
            },
        })

        const expiryMode = 'EX' // expire time in seconds

        await Promise.all(
            currencies.map(async ({ id, code }) => {
                const rate = {
                    code,
                    rate: data.rates[code],
                }

                await this._redisService.redisClient.set(
                    `${RATES_PREFIX}:${id}`,
                    JSON.stringify(rate),
                    expiryMode,
                    this._redisRatesTtl,
                )

                rates.push(rate)
            }),
        )

        return rates
    }
}
