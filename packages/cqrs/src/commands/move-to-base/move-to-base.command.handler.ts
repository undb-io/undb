import type { BaseRepository, ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { MoveToBaseCommand } from './move-to-base.command.js'

type IMoveToBaseCommandHandler = ICommandHandler<MoveToBaseCommand, void>

export class MoveToBaseCommandHandler implements IMoveToBaseCommandHandler {
  constructor(
    protected readonly repo: ITableRepository,
    protected readonly baseRepo: BaseRepository,
  ) {}

  async execute(command: MoveToBaseCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()
    const base = (await this.baseRepo.findOneById(command.baseId)).unwrap()

    const spec = table.moveToBase(base.id)
    if (spec.isNone()) return

    await this.repo.updateOneById(table.id.value, spec.unwrap())
  }
}
