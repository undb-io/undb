import { IRecordRepository, ITableRepository } from '@egodb/core'
import { BulkDeleteRecordsCommand, BulkDeleteRecordsCommandHandler as DomainHandler } from '@egodb/cqrs'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectRecordReposiory, InjectTableReposiory } from '../adapters'

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
