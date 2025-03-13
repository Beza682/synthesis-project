import { Controller, Post, Body } from '@nestjs/common'

import { AuthService } from './auth.service'
import { SignUpDto, SignInDto } from './dtos'
import { AuthUserType } from './types'

@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @Post('sign-up')
    async signUp(@Body() signUpDto: SignUpDto): Promise<AuthUserType> {
        const response = await this._authService.singUp(signUpDto)

        return response
    }

    @Post('sign-in')
    async signIn(@Body() signInDto: SignInDto): Promise<AuthUserType> {
        const response = await this._authService.singIn(signInDto)

        return response
    }
}
