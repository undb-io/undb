import type { ITableRepository } from '@undb/core'
import { type BaseRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { DeleteBaseCommand } from './delete-base.command.js'

type IDeleteBaseCommandHandler = ICommandHandler<DeleteBaseCommand, void>

export class DeleteBaseCommandHandler implements IDeleteBaseCommandHandler {
  constructor(
    protected readonly repo: BaseRepository,
    protected readonly tableRepo: ITableRepository,
  ) {}

  async execute(command: DeleteBaseCommand): Promise<void> {
    const base = (await this.repo.findOneById(command.id)).unwrap()

    await this.repo.deleteOneById(base.id.value)
  }
}
