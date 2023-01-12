import {
  DeleteTableCommand,
  DeleteTableCommandHandler as DomainHandler,
  ITableRepository,
  IUnderlyingTableManager,
} from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory, InjectUndelyingTableManager } from '../adapters'

@CommandHandler(DeleteTableCommand)
export class DeleteTableCommandHandler extends DomainHandler implements ICommandHandler<DeleteTableCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,

    @InjectUndelyingTableManager()
    protected readonly tm: IUnderlyingTableManager,
  ) {
    super(tableRepo, tm)
  }
}
