import {
  DeleteOptionCommand,
  DeleteOptionCommandHandler as DomainHandler,
  ITableRepository,
  IUnderlyingTableManager,
} from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory, InjectUndelyingTableManager } from '../adapters'

@CommandHandler(DeleteOptionCommand)
export class DeleteOptionCommandHandler extends DomainHandler implements ICommandHandler<DeleteOptionCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly OptionRepo: ITableRepository,

    @InjectUndelyingTableManager()
    protected readonly tm: IUnderlyingTableManager,
  ) {
    super(OptionRepo, tm)
  }
}
