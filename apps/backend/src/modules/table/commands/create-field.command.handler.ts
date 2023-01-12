import {
  CreateFieldCommand,
  CreateFieldCommandHandler as DomainHandler,
  ITableRepository,
  IUnderlyingTableManager,
} from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory, InjectUndelyingTableManager } from '../adapters'

@CommandHandler(CreateFieldCommand)
export class CreateFieldCommandHandler extends DomainHandler implements ICommandHandler<CreateFieldCommand, void> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
    @InjectUndelyingTableManager()
    protected readonly tm: IUnderlyingTableManager,
  ) {
    super(tableRepo, tm)
  }
}
