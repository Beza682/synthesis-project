import { JwtModuleOptions } from '@nestjs/jwt'
import { config } from 'dotenv'

config()

export const jwtConfig: JwtModuleOptions = {
    signOptions: { expiresIn: '1d' },
    secret: process.env.JWT_SECRET,
}
