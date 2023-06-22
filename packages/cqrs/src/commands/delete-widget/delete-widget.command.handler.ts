import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { DeleteWidgetCommand } from './delete-widget.command.js'

type IDeleteWidgetCommandHandler = ICommandHandler<DeleteWidgetCommand, void>

export class DeleteWidgetCommandHandler implements IDeleteWidgetCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: DeleteWidgetCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.deleteWidget(command.viewId, command.widgetId)

    await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
