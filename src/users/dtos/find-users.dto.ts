import { Type } from 'class-transformer'
import { IsOptional, IsUUID, ValidateNested } from 'class-validator'

import { FilterDto } from '../../shared/dtos'

export class FindUsersDto {
    @IsUUID('4')
    @IsOptional()
    currencyId?: string

    @Type(() => FilterDto)
    @ValidateNested()
    @IsOptional()
    filter?: FilterDto
}
