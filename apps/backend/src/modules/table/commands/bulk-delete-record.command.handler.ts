import {
  BulkDeleteRecordCommand,
  BulkDeleteRecordCommandHandler as DomainHandler,
  IRecordRepository,
  ITableRepository,
} from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectRecordReposiory, InjectTableReposiory } from '../adapters'

@CommandHandler(BulkDeleteRecordCommand)
export class BulkDeleteRecordCommandHandler extends DomainHandler implements ICommandHandler<BulkDeleteRecordCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,

    @InjectRecordReposiory()
    protected readonly recordRepo: IRecordRepository,
  ) {
    super(tableRepo, recordRepo)
  }
}
