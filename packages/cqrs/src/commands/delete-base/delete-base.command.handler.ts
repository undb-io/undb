import type { ITableRepository } from '@undb/core'
import { WithTableBaseId, type BaseRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import { Some } from 'oxide.ts'
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

    const tables = await this.tableRepo.find(new WithTableBaseId(Some(base.id)))
    for (const table of tables) {
      const spec = table.withoutBase()
      if (spec.isSome()) {
        await this.tableRepo.updateOneById(table.id.value, spec.unwrap())
      }
    }
  }
}
