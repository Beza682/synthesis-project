import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { BigNumber } from 'bignumber.js'
import { Repository } from 'typeorm'

import { comparePassword } from '../shared/utils/bcrypt'
import { UserEntity } from '../users/entities'
import { UserService } from '../users/user.service'

import { AuthUserType } from './types'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly _userRepository: Repository<UserEntity>,
        private readonly _userService: UserService,
        private readonly _jwtService: JwtService,
    ) {}

    async singIn(signIn: {
        login: string
        password: string
    }): Promise<AuthUserType> {
        const foundUser = await this._userRepository.findOne({
            where: { login: signIn.login },
        })

        if (!foundUser) {
            throw new HttpException(
                `Wrong username or password`,
                HttpStatus.BAD_REQUEST,
            )
        }
        const passwordMatch = await comparePassword(
            signIn.password,
            foundUser.password,
        )

        if (!passwordMatch) {
            throw new HttpException(
                `Wrong username or password`,
                HttpStatus.BAD_REQUEST,
            )
        }

        return {
            accessToken: this._jwtService.sign({
                login: foundUser.login,
                sub: foundUser.id,
            }),
        }
    }

    async singUp(signUp: {
        login: string
        password: string
        balance: BigNumber
        currency: { id: string }
    }): Promise<AuthUserType> {
        const user = await this._userService.create(signUp)

        return {
            accessToken: this._jwtService.sign({
                login: user.login,
                sub: user.id,
            }),
        }
    }
}
