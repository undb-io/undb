import type { ClsStore, IClsService } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import { type IApiTokenRepository } from '@undb/openapi'
import type { DeleteApiTokenCommand } from './delete-api-token.command.js'

type IDeleteApiTokenCommandHandler = ICommandHandler<DeleteApiTokenCommand, void>

export class DeleteApiTokenCommandHandler implements IDeleteApiTokenCommandHandler {
  constructor(
    protected readonly apiTokenRepo: IApiTokenRepository,
    protected readonly cls: IClsService<ClsStore>,
  ) {}

  async execute(command: DeleteApiTokenCommand): Promise<void> {
    const existing = await this.apiTokenRepo.findOneById(command.apiTokenId)

    if (existing.isSome()) {
      const userId = this.cls.get('user.userId')
      if (existing.unwrap().userId.value !== userId) {
        throw new Error('cannot delete api token belongs to other user')
      }
      await this.apiTokenRepo.deleteOneById(command.apiTokenId)
    }
  }
}
