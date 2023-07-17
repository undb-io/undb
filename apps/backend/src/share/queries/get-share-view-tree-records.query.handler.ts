import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRecordTreeQueryModel, type ITableQueryModel } from '@undb/core'
import type { IGetShareViewTreeRecordsOutput } from '@undb/cqrs'
import { GetShareViewTreeRecordsQuery, GetShareViewTreeRecordsQueryHandler } from '@undb/cqrs'
import { InjectRecordTreeQueryModel } from '../../core/table/adapters/sqlite/record-sqlite.tree-query-model.js'
import { InjectTableQueryModel } from '../../core/table/adapters/sqlite/table-sqlite.query-model.js'
import { NestShareGuardService } from '../services/share-guard.service.js'

@QueryHandler(GetShareViewTreeRecordsQuery)
export class NestGetShareViewTreeRecordsQueryHandler
  extends GetShareViewTreeRecordsQueryHandler
  implements IQueryHandler<GetShareViewTreeRecordsQuery, IGetShareViewTreeRecordsOutput>
{
  constructor(
    protected readonly guard: NestShareGuardService,
    @InjectTableQueryModel()
    protected readonly tableRepo: ITableQueryModel,
    @InjectRecordTreeQueryModel()
    protected readonly rm: IRecordTreeQueryModel,
  ) {
    super(guard, tableRepo, rm)
  }
}
