import { type IRLSRepository } from '@undb/authz'
import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { DeleteRLSCommand } from './delete-rls.command.js'

type IDeleteRLSCommandHandler = ICommandHandler<DeleteRLSCommand, void>

export class DeleteRLSCommandHandler implements IDeleteRLSCommandHandler {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly repo: IRLSRepository,
  ) {}

  async execute(command: DeleteRLSCommand): Promise<void> {
    await this.repo.deleteOneById(command.id)
  }
}
