import { Controller, Get, Post, Body, Param } from '@nestjs/common'

import { CreateUserDto, FindUsersDto, UpdateUserDto } from './dtos'
import { UsersType, UserType } from './types'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @Post('create')
    async create(@Body() createUserDto: CreateUserDto): Promise<UserType> {
        const response = await this._userService.create(createUserDto)

        return response
    }

    @Get('find')
    async find(@Body() findUserDto: FindUsersDto): Promise<UsersType> {
        const response = await this._userService.find(findUserDto)

        return response
    }

    @Get('find/:id')
    async findOne(@Param('id') id: string): Promise<UserType> {
        const response = await this._userService.findOne(id)

        return response
    }

    @Post('update')
    async update(@Body() updateUserDto: UpdateUserDto): Promise<UserType> {
        const response = await this._userService.update(updateUserDto)

        return response
    }

    @Post('delete/:id')
    async remove(@Param('id') id: string): Promise<string> {
        const response = await this._userService.remove(id)

        return response
    }
}
