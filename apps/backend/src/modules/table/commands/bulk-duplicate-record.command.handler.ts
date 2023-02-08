import {
  BulkDuplicateRecordsCommand,
  BulkDuplicateRecordsCommandHandler as DomainHandler,
  IRecordRepository,
  ITableRepository,
} from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectRecordReposiory, InjectTableReposiory } from '../adapters'

@CommandHandler(BulkDuplicateRecordsCommand)
export class BulkDuplicateRecordsCommandHandler
  extends DomainHandler
  implements ICommandHandler<BulkDuplicateRecordsCommand>
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
