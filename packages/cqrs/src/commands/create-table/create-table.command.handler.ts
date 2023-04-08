import { ITableRepository, ITableSpecHandler, TableFactory, WithTableSchema } from '@undb/core'
import { type ICommandHandler } from '@undb/domain'
import type { ICreateTableOutput } from './create-table.command.interface.js'
import type { CreateTableCommand } from './create-table.command.js'

type ICreateTableCommandHandler = ICommandHandler<CreateTableCommand, ICreateTableOutput>

export class CreateTableCommandHandler implements ICreateTableCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly handler: ITableSpecHandler) {}

  async execute(command: CreateTableCommand): Promise<ICreateTableOutput> {
    const table = TableFactory.from(command).unwrap()

    await this.tableRepo.insert(table)

    await this.handler.handle(table, new WithTableSchema(table.schema))

    return { id: table.id.value }
  }
}
