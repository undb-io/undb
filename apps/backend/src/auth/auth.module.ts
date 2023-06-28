import { Module } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { authConfig } from '../configs/auth.config.js'
import { UserModule } from '../core/user/user.module.js'
import { AuthController } from './auth.controller.js'
import { AuthService } from './auth.service.js'
import {
  NestLgoinCommandHandler,
  NestRegisterCommandHandler,
  NestUpdateProfileCommandHandler,
} from './commands/index.js'
import { JwtStrategy } from './jwt.strategy.js'
import { LocalStrategy } from './local.strategy.js'
import { NestGetMeQueryHandler } from './queries/index.js'

const CommandHandlers = [NestLgoinCommandHandler, NestRegisterCommandHandler, NestUpdateProfileCommandHandler]
const QueryHandlers = [NestGetMeQueryHandler]

@Module({
  imports: [
    CqrsModule,
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigType<typeof authConfig>) => ({
        secret: config.jwt.secret,
        signOptions: {
          expiresIn: '20d',
        },
      }),
      inject: [authConfig.KEY],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, ...CommandHandlers, ...QueryHandlers],
  controllers: [AuthController],
})
export class AuthModule {}
