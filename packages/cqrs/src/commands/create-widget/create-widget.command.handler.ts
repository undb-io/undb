import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { CreateWidgetCommand } from './create-widget.command.js'

type ICreateWidgetCommandHandler = ICommandHandler<CreateWidgetCommand, void>

export class CreateWidgetCommandHandler implements ICreateWidgetCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: CreateWidgetCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.createWidget(command.viewId, command.widget)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
