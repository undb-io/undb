import { type ICommandHandler } from '@egodb/domain'
import type { ITableRepository } from '../../table.repository'
import type { CreateOptionCommand } from './create-option.command'

type ICreateOptionCommandHandler = ICommandHandler<CreateOptionCommand, void>

export class CreateOptionCommandHandler implements ICreateOptionCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: CreateOptionCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.createOption(command.fieldKey, command.option)

    await this.repo.updateOneById(table.id.value, spec)
  }
}
