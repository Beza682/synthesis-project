import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../jwt/guards/jwt-auth.guard'

import { CurrencyService } from './currency.service'
import { CreateCurrencyDto, UpdateCurrencyDto } from './dtos'
import { CurrencyType } from './types'

@UseGuards(JwtAuthGuard)
@Controller('currency')
export class CurrencyController {
    constructor(private readonly _currencyService: CurrencyService) {}

    @Post('create')
    async create(
        @Body() createCurrencyDto: CreateCurrencyDto[],
    ): Promise<CurrencyType | CurrencyType[]> {
        const response = await this._currencyService.create(createCurrencyDto)

        return response
    }

    @Get('find')
    async find(): Promise<CurrencyType[]> {
        const response = await this._currencyService.find()

        return response
    }

    @Get('find/:id')
    async findOne(@Param('id') id: string): Promise<CurrencyType> {
        const response = await this._currencyService.findOne(id)

        return response
    }

    @Post('update')
    async update(
        @Body() updateCurrencyDto: UpdateCurrencyDto[],
    ): Promise<CurrencyType | CurrencyType[]> {
        const response = await this._currencyService.update(updateCurrencyDto)

        return response
    }

    @Post('delete')
    async remove(@Body() ids: string[]): Promise<string | string[]> {
        const response = await this._currencyService.remove(ids)

        return response
    }
}
