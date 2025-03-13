import { Controller, Get, UseGuards, Query } from '@nestjs/common'

import { JwtAuthGuard } from '../jwt/guards/jwt-auth.guard'

import { GetRatesDto } from './dtos'
import { RatesService } from './rates.service'

@UseGuards(JwtAuthGuard)
@Controller('rates')
export class RatesController {
    constructor(private readonly _ratesService: RatesService) {}

    @Get()
    async getRates(@Query() { ids }: GetRatesDto): Promise<unknown> {
        const response = await this._ratesService.getRates(ids)

        return response
    }
}
