import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from '../modules/user/user.module.js'
import { AuthController } from './auth.controller.js'
import { AuthService } from './auth.service.js'
import { NestLgoinCommandHandler, NestRegisterCommandHandler } from './commands/index.js'
import { jwtConstants } from './constants.js'
import { JwtStrategy } from './jwt.strategy.js'
import { LocalStrategy } from './local.strategy.js'
import { NestGetMeQueryHandler } from './queries/index.js'

const CommandHandlers = [NestLgoinCommandHandler, NestRegisterCommandHandler]
const QueryHandlers = [NestGetMeQueryHandler]

@Module({
  imports: [
    CqrsModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '20d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, ...CommandHandlers, ...QueryHandlers],
  controllers: [AuthController],
})
export class AuthModule {}
