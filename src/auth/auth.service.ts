/* eslint-disable @typescript-eslint/naming-convention */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { comparePassword } from '../shared/utils/bcrypt'
import { UserEntity } from '../users/entities'
import { UserService } from '../users/user.service'

import { SignInDto, SignUpDto } from './dtos'
import { AuthUserType } from './types'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly _userRepository: Repository<UserEntity>,
        private readonly _userService: UserService,
        private readonly _jwtService: JwtService,
    ) {}

    async singIn(signInDto: SignInDto): Promise<AuthUserType> {
        const foundUser = await this._userRepository.findOne({
            where: { login: signInDto.login },
        })

        if (!foundUser) {
            throw new HttpException(
                `Wrong username or password`,
                HttpStatus.BAD_REQUEST,
            )
        }
        const passwordMatch = await comparePassword(
            signInDto.password,
            foundUser.password,
        )

        if (!passwordMatch) {
            throw new HttpException(
                `Wrong username or password`,
                HttpStatus.BAD_REQUEST,
            )
        }

        return {
            access_token: this._jwtService.sign({
                login: foundUser.login,
                sub: foundUser.id,
            }),
        }
    }

    async singUp(signUpDto: SignUpDto): Promise<AuthUserType> {
        const user = await  this._userService.create(signUpDto)

        return {
            access_token: this._jwtService.sign({
                login: user.login,
                sub: user.id,
            }),
        }
    }
}
