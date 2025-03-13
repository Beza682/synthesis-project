import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Delete,
    Patch,
    ParseUUIDPipe,
} from '@nestjs/common'

import { JwtAuthGuard } from '../jwt/guards/jwt-auth.guard'

import { CurrencyService } from './currency.service'
import { CreateCurrencyDto, UpdateCurrencyDto } from './dtos'
import { CurrencyType } from './types'

@UseGuards(JwtAuthGuard)
@Controller('currency')
export class CurrencyController {
    constructor(private readonly _currencyService: CurrencyService) {}

    @Post()
    async create(
        @Body() createCurrencyDto: CreateCurrencyDto[],
    ): Promise<CurrencyType[]> {
        const response = await this._currencyService.create(createCurrencyDto)

        return response
    }

    @Get()
    async find(): Promise<CurrencyType[]> {
        const response = await this._currencyService.find()

        return response
    }

    @Get(':id')
    async findOne(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<CurrencyType> {
        const response = await this._currencyService.findOne({ id })

        return response
    }

    @Patch(':id')
    async update(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        @Body() updateCurrencyDto: UpdateCurrencyDto[],
    ): Promise<CurrencyType | CurrencyType[]> {
        const response = await this._currencyService.update({
            id,
            ...updateCurrencyDto,
        })

        return response
    }

    @Delete(':id')
    async remove(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<string> {
        const response = await this._currencyService.remove(id)

        return response
    }
}
