import { CommandHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { DeleteApiTokenCommand, DeleteApiTokenCommandHandler } from '@undb/cqrs'
import { type IApiTokenRepository } from '@undb/openapi'
import { ClsService } from 'nestjs-cls'
import { InjectApiTokenRepository } from '../adapters/api-token.sqlite-repository.js'

@CommandHandler(DeleteApiTokenCommand)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class NestDeleteApiTokenCommandHandler extends DeleteApiTokenCommandHandler {
  constructor(
    protected readonly cls: ClsService<ClsStore>,
    @InjectApiTokenRepository()
    protected readonly repo: IApiTokenRepository,
  ) {
    super(repo, cls as IClsService<ClsStore>)
  }
}
