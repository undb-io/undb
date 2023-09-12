import { Injectable } from '@nestjs/common'
import { type ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import type { ClsStore, IClsService } from '@undb/core'
import type { Request } from 'express'
import { ClsService } from 'nestjs-cls'
import type { JwtFromRequestFunction } from 'passport-jwt'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { authConfig } from '../configs/auth.config.js'
import { InjectAuthConfig } from '../configs/auth.config.js'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectAuthConfig() config: ConfigType<typeof authConfig>,
    private readonly cls: ClsService<ClsStore>,
  ) {
    super({
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
    })
  }

  public static extractJWT(req: Request): string | null {
    return req.cookies?.['undb_auth'] ?? null
  }

  public static setCls(cls: IClsService<ClsStore>, payload: any) {
    cls.set('user.userId', payload.sub)
    cls.set('user.isAnonymous', false)
  }

  async validate(payload: any) {
    JwtStrategy.setCls(this.cls as IClsService<ClsStore>, payload)
    return { userId: payload.sub, email: payload.email }
  }
}

export const jwtFromRequest: JwtFromRequestFunction = ExtractJwt.fromExtractors([
  JwtStrategy.extractJWT,
  ExtractJwt.fromAuthHeaderAsBearerToken(),
])
