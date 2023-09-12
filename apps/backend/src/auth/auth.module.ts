import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PassportModule } from '@nestjs/passport'
import { AuthzModule } from '../authz/authz.module.js'
import { MemberModule } from '../authz/member/member.module.js'
import { UserModule } from '../core/user/user.module.js'
import { ApiTokenModule } from '../openapi/api-token/api-token.module.js'
import { ApiTokenGuard } from './api-token/api-token.guard.js'
import { ApiTokenStrategy } from './api-token/api-token.strategy.js'
import { AuthController } from './auth.controller.js'
import { AuthService } from './auth.service.js'
import {
  NestLgoinCommandHandler,
  NestRegisterCommandHandler,
  NestUpdateProfileCommandHandler,
} from './commands/index.js'
import { CryptService } from './crypt.service.js'
import { JwtStrategy } from './jwt.strategy.js'
import { LocalStrategy } from './local.strategy.js'
import { NestGetMeQueryHandler } from './queries/index.js'
import { NestUserService } from './user.service.js'

const CommandHandlers = [NestLgoinCommandHandler, NestRegisterCommandHandler, NestUpdateProfileCommandHandler]
const QueryHandlers = [NestGetMeQueryHandler]

@Module({
  imports: [CqrsModule, UserModule, AuthzModule, PassportModule, MemberModule, ApiTokenModule],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    ApiTokenStrategy,
    ApiTokenGuard,
    ...CommandHandlers,
    ...QueryHandlers,
    CryptService,
    NestUserService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
