import type { ICommandHandler } from '@egodb/domain'
import type { ITableRepository } from '../../table.repository.js'
import type { SetFieldWidthCommand } from './set-field-width.command.js'

export class SetFieldWidthCommandHandler implements ICommandHandler<SetFieldWidthCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: SetFieldWidthCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.setFieldWidth(command)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
