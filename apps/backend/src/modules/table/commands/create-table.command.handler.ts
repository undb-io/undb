import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsStore, TableSpecHandler, type ITableRepository } from '@undb/core'
import { CreateTableCommand, CreateTableCommandHandler as DomainHandler } from '@undb/cqrs'
import { ClsService } from 'nestjs-cls'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(CreateTableCommand)
export class CreateTableCommandHandler extends DomainHandler implements ICommandHandler<CreateTableCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
    protected readonly handler: TableSpecHandler,
    protected readonly cls: ClsService<ClsStore>,
  ) {
    super(repo, handler, cls)
  }
}
