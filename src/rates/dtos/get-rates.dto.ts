import { Transform } from 'class-transformer'
import { IsOptional, IsUUID } from 'class-validator'

export class GetRatesDto {
    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @IsUUID('4', { each: true })
    ids?: string[]
}
