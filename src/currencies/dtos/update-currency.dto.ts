import { IsISO4217CurrencyCode, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class UpdateCurrencyDto {
    @IsUUID('4')
    id: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?:string

    @IsISO4217CurrencyCode()
    @IsNotEmpty()
    @IsOptional()
    code?:string
}
