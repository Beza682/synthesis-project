import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ParseUUIDPipe,
    Query,
} from '@nestjs/common'

import { CreateUserDto, FindUsersDto } from './dtos'
import { UsersType, UserType } from './types'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<UserType> {
        const response = await this._userService.create(createUserDto)

        return response
    }

    @Get()
    async find(@Query() findUserDto: FindUsersDto): Promise<UsersType> {
        const response = await this._userService.find(findUserDto)

        return response
    }

    @Get(':id')
    async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<UserType> {
        const response = await this._userService.findOne(id)

        return response
    }

    @Delete(':id')
    async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<string> {
        const response = await this._userService.remove(id)

        return response
    }
}
