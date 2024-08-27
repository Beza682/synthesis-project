import { Type } from 'class-transformer'
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator'

export class FilterDto {
    @Type(() => Number)
    @Min(0)
    @IsInt()
    @IsNumber()
    @IsOptional()
    offset?: number

    @Type(() => Number)
    @Min(1)
    @IsInt()
    @IsNumber()
    @IsOptional()
    limit?: number
}
