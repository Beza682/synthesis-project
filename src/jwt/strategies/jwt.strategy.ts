/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { config } from 'dotenv'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { JwtPayload } from '../types'

config()

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
            logging: true,
        })
    }

    async validate(payload: JwtPayload) {
        return { userId: payload.sub, login: payload.login }
    }
}
