import type { ICommandHandler } from '@egodb/domain'
import type { ITableRepository } from '../../table.repository'
import type { EditTableCommand } from './edit-table.command'

type IEditTableCommandHandler = ICommandHandler<EditTableCommand, void>

export class EditTableCommandHandler implements IEditTableCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: EditTableCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.id)).unwrap()

    const spec = table.edit(command)

    if (spec.isSome()) {
      await this.tableRepo.updateOneById(table.id.value, spec.unwrap())
    }
  }
}
