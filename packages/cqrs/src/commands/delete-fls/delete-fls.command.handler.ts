import { type IFLSRepository } from '@undb/authz'
import type { ICommandHandler } from '@undb/domain'
import type { DeleteFLSCommand } from './delete-fls.command.js'

type IDeleteFLSCommandHandler = ICommandHandler<DeleteFLSCommand, void>

export class DeleteFLSCommandHandler implements IDeleteFLSCommandHandler {
  constructor(protected readonly repo: IFLSRepository) {}

  async execute(command: DeleteFLSCommand): Promise<void> {
    await this.repo.deleteOneById(command.id)
  }
}
