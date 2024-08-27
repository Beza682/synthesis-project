import { BadRequestException, HttpStatus } from '@nestjs/common'
import { BigNumber } from 'bignumber.js'
import { Transform, TransformFnParams, Type } from 'class-transformer'
import { IsNotEmpty, matches, ValidateNested } from 'class-validator'

import { RelatedDto } from '../../shared/dtos'
import { BIGNUMBER_REGEX } from '../../shared/regex'

export class CreateTransactionDto {
    @Transform(({ value, key }: TransformFnParams) => {
        if (!matches(value, BIGNUMBER_REGEX)) {
            throw new BadRequestException({
                message: `${key} must be specified as a floating dot number.`,
                error: 'Bad Request',
                statusCode: HttpStatus.BAD_REQUEST,
           })
        }

        return new BigNumber(value)
    })
    @IsNotEmpty()
    amount: BigNumber

    @Type(() => RelatedDto)
    @ValidateNested()
    from: RelatedDto

    @Type(() => RelatedDto)
    @ValidateNested()
    to: RelatedDto
}
