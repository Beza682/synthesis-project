import { IsISO4217CurrencyCode, IsNotEmpty, IsString } from "class-validator"

export class CreateCurrencyDto {
    @IsString()
    @IsNotEmpty()
    name:string

    @IsISO4217CurrencyCode()
    @IsNotEmpty()
    code:string
}
