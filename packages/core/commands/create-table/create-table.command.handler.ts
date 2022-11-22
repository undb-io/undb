import { type ICommandHandler } from '@egodb/domain'
import { ITableRepository } from '../../repository'
import { Table } from '../../table'
import { CreateTableCommand } from './create-table.command'
import { ICreateTableOutput } from './create-table.command.interface'

type ICreateTableCommandHandler = ICommandHandler<CreateTableCommand, ICreateTableOutput>

export class CreateTableCommandHandler implements ICreateTableCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: CreateTableCommand): Promise<ICreateTableOutput> {
    const table = Table.create(command.name)
    await this.repo.insert(table)
  }
}
