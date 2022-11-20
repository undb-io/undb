import { type ICommandHandler } from '@egodb/domain'
import { ITableRepository } from '../repository'
import { Table } from '../table'
import { CreateTableCommand } from './create-table.command'

type ICreateTableCommandHandler = ICommandHandler<CreateTableCommand>

export class CreateTableCommandHandler implements ICreateTableCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: CreateTableCommand): Promise<any> {
    const table = Table.create(command.name)
    await this.repo.insert(table)
  }
}
