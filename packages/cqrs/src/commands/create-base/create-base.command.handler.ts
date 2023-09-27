import type { ITableRepository } from '@undb/core'
import { BaseFactory, type BaseRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { CreateBaseCommand } from './create-base.command.js'

type ICreateBaseCommandHandler = ICommandHandler<CreateBaseCommand, void>

export class CreateBaseCommandHandler implements ICreateBaseCommandHandler {
  constructor(
    protected readonly repo: BaseRepository,
    protected readonly tableRepo: ITableRepository,
  ) {}

  async execute(command: CreateBaseCommand): Promise<void> {
    const base = BaseFactory.new(command)

    await this.repo.insert(base)

    if (command.tableIds) {
      for (const tableId of command.tableIds) {
        const table = (await this.tableRepo.findOneById(tableId)).into()
        if (!table) continue

        const spec = table.moveToBase(base.id)

        if (spec.isSome()) {
          await this.tableRepo.updateOneById(table.id.value, spec.unwrap())
        }
      }
    }
  }
}
