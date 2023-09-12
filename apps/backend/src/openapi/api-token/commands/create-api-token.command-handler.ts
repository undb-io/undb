import { CommandHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { CreateApiTokenCommand, CreateApiTokenCommandHandler } from '@undb/cqrs'
import { type IApiTokenRepository } from '@undb/openapi'
import { ClsService } from 'nestjs-cls'
import { InjectApiTokenRepository } from '../adapters/api-token.sqlite-repository.js'

@CommandHandler(CreateApiTokenCommand)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class NestCreateApiTokenCommandHandler extends CreateApiTokenCommandHandler {
  constructor(
    protected readonly cls: ClsService<ClsStore>,
    @InjectApiTokenRepository()
    protected readonly repo: IApiTokenRepository,
  ) {
    super(cls as IClsService<ClsStore>, repo)
  }
}
