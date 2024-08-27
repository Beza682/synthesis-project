import { Controller, Get, Body, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../jwt/guards/jwt-auth.guard'

import { RatesService } from './rates.service'

@UseGuards(JwtAuthGuard)
@Controller('rates')
export class RatesController {
    constructor(private readonly _ratesService: RatesService) {}

    @Get('getRates')
    async getRates(@Body() ids?: string[]): Promise<unknown> {
        const response = await this._ratesService.getRates(ids)

        return response
    }
}
