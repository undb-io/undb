import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import type { ClsStore } from '@undb/core'
import { API_TOKEN_HEADER_NAME, WithApiTokenToken, type IApiTokenRepository } from '@undb/openapi'
import type { Request } from 'express'
import { ClsService } from 'nestjs-cls'
import { Strategy } from 'passport-custom'
import { InjectApiTokenRepository } from '../../openapi/api-token/adapters/api-token.sqlite-repository.js'
import { API_TOKEN_AUTH } from './api-token.constants.js'

@Injectable()
export class ApiTokenStrategy extends PassportStrategy(Strategy, API_TOKEN_AUTH) {
  constructor(
    @InjectApiTokenRepository()
    private readonly repo: IApiTokenRepository,
    private readonly cls: ClsService<ClsStore>,
  ) {
    super()
  }

  async validate(req: Request) {
    const token = req.headers[API_TOKEN_HEADER_NAME]
    if (!token) return
    if (typeof token !== 'string') return

    const spec = WithApiTokenToken.fromString(token)
    const apiToken = (await this.repo.findOne(spec)).unwrap()

    const userId = apiToken.userId.value
    this.cls.set('user.userId', userId)
    this.cls.set('user.isApiToken', true)

    return { userId }
  }
}
