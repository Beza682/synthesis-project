import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { jwtConfig } from '../config/jwt.config'
import { JwtStrategy } from '../jwt/strategies/jwt.strategy'
import { UserEntity } from '../users/entities'
import { UserModule } from '../users/user.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register(jwtConfig),
        PassportModule,
        UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
