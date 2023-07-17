import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRecordQueryModel, type ITableRepository } from '@undb/core'
import type { IGetTreeAvailableRecordsOutput } from '@undb/cqrs'
import { GetTreeAvailableRecordsQuery, GetTreeAvailableRecordsQueryHandler } from '@undb/cqrs'
import { InjectRecordQueryModel } from '../adapters/sqlite/record-sqlite.query-model.js'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@QueryHandler(GetTreeAvailableRecordsQuery)
export class NestGetTreeAvailableRecordsQueryHandler
  extends GetTreeAvailableRecordsQueryHandler
  implements IQueryHandler<GetTreeAvailableRecordsQuery, IGetTreeAvailableRecordsOutput>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordQueryModel()
    protected readonly rm: IRecordQueryModel,
  ) {
    super(tableRepo, rm)
  }
}
