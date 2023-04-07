import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module.js'
import { AuthController } from './auth.controller.js'
import { AuthService } from './auth.service.js'
import { LgoinCommandHandler } from './commands/login/login.command.hander.js'
import { jwtConstants } from './constants.js'
import { JwtStrategy } from './jwt.strategy.js'
import { LocalStrategy } from './local.strategy.js'
import { GetMeQueryHandler } from './queries/index.js'

const CommandHandlers = [LgoinCommandHandler]
const QueryHandlers = [GetMeQueryHandler]

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, ...CommandHandlers, ...QueryHandlers],
  controllers: [AuthController],
})
export class AuthModule {}
