import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import { BulkDeleteRecordsCommand, BulkDeleteRecordsCommandHandler as DomainHandler } from '@undb/cqrs'
import { InjectRecordReposiory, InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(BulkDeleteRecordsCommand)
export class BulkDeleteRecordsCommandHandler
  extends DomainHandler
  implements ICommandHandler<BulkDeleteRecordsCommand>
{
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,

    @InjectRecordReposiory()
    protected readonly recordRepo: IRecordRepository,
  ) {
    super(tableRepo, recordRepo)
  }
}
