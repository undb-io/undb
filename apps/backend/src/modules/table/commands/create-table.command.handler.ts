import {
  CreateTableCommand,
  CreateTableCommandHandler as DomainHandler,
  IUnderlyingTableManager,
  type ITableRepository,
} from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory, InjectUndelyingTableManager } from '../adapters'

@CommandHandler(CreateTableCommand)
export class CreateTableCommandHandler extends DomainHandler implements ICommandHandler<CreateTableCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
    @InjectUndelyingTableManager()
    protected readonly tm: IUnderlyingTableManager,
  ) {
    super(repo, tm)
  }
}
