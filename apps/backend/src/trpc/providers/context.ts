import type { Provider } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type * as trpcExpress from '@trpc/server/adapters/express'
import type { IMemberService } from '@undb/authz'
import type { IClsService } from '@undb/core'
import { AnonymousService, type ClsStore } from '@undb/core'
import { ClsService } from 'nestjs-cls'
import { JwtStrategy, jwtFromRequest } from '../../auth/jwt.strategy.js'
import { NestMemberService } from '../../authz/member/member.service.js'
import { authConfig } from '../../configs/auth.config.js'

export const TRPC_CONTEXT = Symbol('TRPC_CONTEXT')

export const context: Provider = {
  provide: TRPC_CONTEXT,
  inject: [ClsService<ClsStore>, JwtService, authConfig.KEY, NestMemberService],
  useFactory: (
    cls: IClsService<ClsStore>,
    jwtService: JwtService,
    config: ConfigType<typeof authConfig>,
    memberService: IMemberService,
  ) => {
    return async ({ req }: trpcExpress.CreateExpressContextOptions) => {
      const jwt = jwtFromRequest(req)
      if (jwt) {
        const payload = await jwtService.verifyAsync(jwt, { secret: config.jwt.secret })
        JwtStrategy.setCls(cls, payload)
        await memberService.setCurrentMember()
      } else {
        AnonymousService.setCls(cls)
      }

      return cls
    }
  },
}
