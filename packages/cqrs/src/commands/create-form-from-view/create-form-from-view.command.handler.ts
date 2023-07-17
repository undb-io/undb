import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { CreateFormFromViewCommand } from './create-form-from-view.command.js'

type ICreateFormFromViewCommandHandler = ICommandHandler<CreateFormFromViewCommand, void>

export class CreateFormFromViewCommandHandler implements ICreateFormFromViewCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: CreateFormFromViewCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.createFormFromView(command.viewId, command.form)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
