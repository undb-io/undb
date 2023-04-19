import { Injectable } from '@nestjs/common'
import { type ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ClsStore } from '@undb/core'
import type { Request } from 'express'
import { ClsService } from 'nestjs-cls'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { InjectAuthConfig, authConfig } from '../configs/auth.config.js'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectAuthConfig() config: ConfigType<typeof authConfig>, private readonly cls: ClsService<ClsStore>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT, ExtractJwt.fromAuthHeaderAsBearerToken()]),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
    })
  }

  private static extractJWT(req: Request): string | null {
    return req.cookies?.['undb'] ?? null
  }

  async validate(payload: any) {
    this.cls.set('user.userId', payload.sub)
    return { userId: payload.sub, email: payload.email }
  }
}
