import type { ICommandHandler } from '@egodb/domain'
import type { ITableRepository } from '../../table.repository'
import type { EditTableCommand } from './edit-table.command'

type IEditTableCommandHandler = ICommandHandler<EditTableCommand, void>

export class EditTableCommandHandler implements IEditTableCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  execute(command: EditTableCommand): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
