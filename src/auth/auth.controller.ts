import {
    Controller,
    Get,
    Post,
    Body,
} from '@nestjs/common'

import { AuthService } from './auth.service'
import { SignUpDto, SignInDto } from './dtos'

@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @Post('sign-up')
    async signUp(@Body() signUpDto: SignUpDto): Promise<unknown> {
        const response = await this._authService.singUp(signUpDto)

        return response
    }

    @Get('sign-in')
    async signIn(@Body() signInDto: SignInDto): Promise<unknown> {
        const response = await this._authService.singIn(signInDto)

        return response
    }
}
