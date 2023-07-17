import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRecordQueryModel, type ITableQueryModel } from '@undb/core'
import type { IGetShareViewRecordOutput } from '@undb/cqrs'
import { GetShareViewRecordQuery, GetShareViewRecordQueryHandler } from '@undb/cqrs'
import { InjectRecordQueryModel } from '../../core/table/adapters/sqlite/record-sqlite.query-model.js'
import { InjectTableQueryModel } from '../../core/table/adapters/sqlite/table-sqlite.query-model.js'
import { NestShareGuardService } from '../services/share-guard.service.js'

@QueryHandler(GetShareViewRecordQuery)
export class NestGetShareViewRecordQueryHandler
  extends GetShareViewRecordQueryHandler
  implements IQueryHandler<GetShareViewRecordQuery, IGetShareViewRecordOutput>
{
  constructor(
    guard: NestShareGuardService,
    @InjectTableQueryModel()
    protected readonly tableRepo: ITableQueryModel,
    @InjectRecordQueryModel()
    protected readonly rm: IRecordQueryModel,
  ) {
    super(guard, tableRepo, rm)
  }
}
