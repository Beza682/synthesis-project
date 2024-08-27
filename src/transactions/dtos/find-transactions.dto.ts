import { Type } from 'class-transformer'
import { IsOptional, IsUUID, ValidateNested } from 'class-validator'

import { FilterDto } from '../../shared/dtos'

export class FindTransactionsDto {
    @IsUUID('4')
    @IsOptional()
    fromId?: string

    @IsUUID('4')
    @IsOptional()
    toId?: string

    @Type(() => FilterDto)
    @ValidateNested()
    @IsOptional()
    filter?: FilterDto
}
