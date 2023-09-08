import type { ClsStore, IClsService } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { IApiTokenRepository } from '@undb/openapi'
import { ApiTokenFactory } from '@undb/openapi'
import type { CreateApiTokenCommand } from './create-api-token.command.js'

type ICreateApiTokenCommandHandler = ICommandHandler<CreateApiTokenCommand, void>

export class CreateApiTokenCommandHandler implements ICreateApiTokenCommandHandler {
  constructor(
    protected readonly cls: IClsService<ClsStore>,
    protected readonly repo: IApiTokenRepository,
  ) {}

  async execute(command: CreateApiTokenCommand): Promise<void> {
    const userId = this.cls.get('user.userId')

    const token = ApiTokenFactory.new(userId)

    await this.repo.insert(token)
  }
}
