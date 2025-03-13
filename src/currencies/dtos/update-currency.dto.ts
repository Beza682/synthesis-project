import {
    IsISO4217CurrencyCode,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator'

import { IUpdateCurrency } from '../interfaces'

export class UpdateCurrencyDto implements Omit<IUpdateCurrency, 'id'> {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    name?: string

    @IsISO4217CurrencyCode()
    @IsOptional()
    @IsNotEmpty()
    code?: string
}
