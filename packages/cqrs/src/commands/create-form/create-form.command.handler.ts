import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { CreateFormCommand } from './create-form.command.js'

type ICreateFormCommandHandler = ICommandHandler<CreateFormCommand, void>

export class CreateFormCommandHandler implements ICreateFormCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: CreateFormCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.createForm(command.form)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
