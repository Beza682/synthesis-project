import { BadRequestException, HttpStatus } from '@nestjs/common'
import { BigNumber } from 'bignumber.js'
import { Transform, TransformFnParams, Type } from 'class-transformer'
import { IsNotEmpty, IsString, matches, ValidateNested } from 'class-validator'

import { RelatedDto } from '../../shared/dtos/related.dto'
import { POSITIVE_BIGNUMBER_REGEX } from '../../shared/regex'

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    login: string

    @IsString()
    @IsNotEmpty()
    password: string

    @Transform(({ value, key }: TransformFnParams) => {
        if (!matches(value, POSITIVE_BIGNUMBER_REGEX)) {
            throw new BadRequestException({
                message: `${key} must have the format of a positive floating dot number`,
                error: 'Bad Request',
                statusCode: HttpStatus.BAD_REQUEST,
            })
        }

        return new BigNumber(value)
    })
    @IsNotEmpty()
    balance: BigNumber

    @Type(() => RelatedDto)
    @ValidateNested()
    currency: RelatedDto
}
