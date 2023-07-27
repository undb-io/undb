import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRecordQueryModel, type ITableRepository } from '@undb/core'
import type { IGetTrashRecordsOutput } from '@undb/cqrs'
import { GetTrashRecordsQuery, GetTrashRecordsQueryHandler } from '@undb/cqrs'
import { InjectRecordQueryModel } from '../adapters/sqlite/record-sqlite.query-model.js'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@QueryHandler(GetTrashRecordsQuery)
export class NestGetTrashRecordsQueryHandler
  extends GetTrashRecordsQueryHandler
  implements IQueryHandler<GetTrashRecordsQuery, IGetTrashRecordsOutput>
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
