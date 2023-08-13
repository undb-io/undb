import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PassportModule } from '@nestjs/passport'
import { MemberModule } from '../authz/member/member.module.js'
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
  imports: [CqrsModule, UserModule, PassportModule, MemberModule],
  providers: [AuthService, LocalStrategy, JwtStrategy, ...CommandHandlers, ...QueryHandlers],
  controllers: [AuthController],
})
export class AuthModule {}
