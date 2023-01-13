import { type ICommandHandler } from '@egodb/domain'
import { TableFactory } from '../../table.factory'
import type { ITableRepository } from '../../table.repository'
import type { CreateTableCommand } from './create-table.command'
import type { ICreateTableOutput } from './create-table.command.interface'

type ICreateTableCommandHandler = ICommandHandler<CreateTableCommand, ICreateTableOutput>

export class CreateTableCommandHandler implements ICreateTableCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: CreateTableCommand): Promise<ICreateTableOutput> {
    const table = TableFactory.from(command).unwrap()

    await this.repo.insert(table)

    return { id: table.id.value }
  }
}
