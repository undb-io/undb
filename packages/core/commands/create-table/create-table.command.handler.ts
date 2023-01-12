import { type ICommandHandler } from '@egodb/domain'
import { TableFactory } from '../../table.factory'
import type { ITableRepository } from '../../table.repository'
import type { IUnderlyingTableManager } from '../../underlying-table.manager'
import type { CreateTableCommand } from './create-table.command'
import type { ICreateTableOutput } from './create-table.command.interface'

type ICreateTableCommandHandler = ICommandHandler<CreateTableCommand, ICreateTableOutput>

export class CreateTableCommandHandler implements ICreateTableCommandHandler {
  constructor(protected readonly repo: ITableRepository, protected readonly tm: IUnderlyingTableManager) {}

  async execute(command: CreateTableCommand): Promise<ICreateTableOutput> {
    const table = TableFactory.from(command).unwrap()

    // FIXME: transaction
    await this.repo.insert(table)
    await this.tm.create(table)

    return { id: table.id.value }
  }
}
