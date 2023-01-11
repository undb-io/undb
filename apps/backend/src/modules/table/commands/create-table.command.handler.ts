import { CreateTableCommand, CreateTableCommandHandler as DomainHandler, type ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'
import { NestTableSqliteManager } from '../adapters/sqlite/table-sqlite.manager'

@CommandHandler(CreateTableCommand)
export class CreateTableCommandHandler extends DomainHandler implements ICommandHandler<CreateTableCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
    protected readonly tm: NestTableSqliteManager,
  ) {
    super(repo, tm)
  }
}
