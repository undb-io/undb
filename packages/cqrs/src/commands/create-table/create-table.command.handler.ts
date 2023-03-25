import { ITableRepository, TableFactory, TableSpecHandler, WithTableSchema } from '@egodb/core'
import { type ICommandHandler } from '@egodb/domain'
import type { ICreateTableOutput } from './create-table.command.interface.js'
import type { CreateTableCommand } from './create-table.command.js'

type ICreateTableCommandHandler = ICommandHandler<CreateTableCommand, ICreateTableOutput>

export class CreateTableCommandHandler implements ICreateTableCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: CreateTableCommand): Promise<ICreateTableOutput> {
    const table = TableFactory.from(command).unwrap()

    await this.tableRepo.insert(table)

    const tsh = new TableSpecHandler(this.tableRepo)
    await tsh.handle(table, new WithTableSchema(table.schema))

    return { id: table.id.value }
  }
}
