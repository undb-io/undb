import type { ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { SetFormFieldsOrderCommand } from './set-form-fields-order.command.js'

type ISetFormFieldsOrderCommandHandler = ICommandHandler<SetFormFieldsOrderCommand, void>

export class SetFormFieldsOrderCommandHandler implements ISetFormFieldsOrderCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: SetFormFieldsOrderCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.setFormFieldsOrder(command)

    await this.repo.updateOneById(command.tableId, spec)
  }
}
