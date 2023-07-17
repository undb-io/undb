import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { UpdateFormCommand } from './update-form.command.js'

type IUpdateFormCommandHandler = ICommandHandler<UpdateFormCommand, void>

export class UpdateFormCommandHandler implements IUpdateFormCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: UpdateFormCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.updateForm(command.formId, command)

    if (spec.isSome()) {
      await this.tableRepo.updateOneById(table.id.value, spec.unwrap())
    }
  }
}
