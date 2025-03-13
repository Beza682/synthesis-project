import { IsISO4217CurrencyCode, IsNotEmpty, IsString } from 'class-validator'

import { ICreateCurrency } from '../interfaces'

export class CreateCurrencyDto implements ICreateCurrency {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsISO4217CurrencyCode()
    @IsNotEmpty()
    code: string
}
