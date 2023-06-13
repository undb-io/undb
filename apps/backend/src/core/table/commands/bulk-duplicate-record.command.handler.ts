import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import { BulkDuplicateRecordsCommand, BulkDuplicateRecordsCommandHandler as DomainHandler } from '@undb/cqrs'
import { InjectRecordRepository, InjectTableRepository } from '../adapters/index.js'

@CommandHandler(BulkDuplicateRecordsCommand)
export class BulkDuplicateRecordsCommandHandler
  extends DomainHandler
  implements ICommandHandler<BulkDuplicateRecordsCommand>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,

    @InjectRecordRepository()
    protected readonly recordRepo: IRecordRepository,
  ) {
    super(tableRepo, recordRepo)
  }
}
