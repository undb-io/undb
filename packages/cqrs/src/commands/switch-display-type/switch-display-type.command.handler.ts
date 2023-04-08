import type { ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { SwitchDisplayTypeCommand } from './switch-display-type.command.js'

export class SwitchDisplayTypeCommandHandler implements ICommandHandler<SwitchDisplayTypeCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: SwitchDisplayTypeCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.switchDisplayType(command)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
