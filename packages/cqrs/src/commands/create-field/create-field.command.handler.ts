import type { ITableSpecHandler } from '@undb/core'
import { type ITableRepository } from '@undb/core'
import type { ICommandHandler, IUnitOfWork } from '@undb/domain'
import type { CreateFieldCommand } from './create-field.command.js'

type ICreateFieldCommandHandler = ICommandHandler<CreateFieldCommand, void>

export class CreateFieldCommandHandler implements ICreateFieldCommandHandler {
  constructor(
    protected readonly uow: IUnitOfWork,
    protected readonly tableRepo: ITableRepository,
    protected readonly handler: ITableSpecHandler,
  ) {}

  async execute(command: CreateFieldCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const spec = table.createField(command.viewId, command.field, command.at)

    await this.tableRepo.updateOneById(table.id.value, spec)
    await this.handler.handle(table, spec)
  }
}
