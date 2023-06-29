import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRecordQueryModel, type ITableQueryModel } from '@undb/core'
import type { IGetShareViewRecordsOutput } from '@undb/cqrs'
import { GetShareViewRecordsQuery, GetShareViewRecordsQueryHandler } from '@undb/cqrs'
import { type IShareRepository } from '@undb/integrations'
import { InjectRecordQueryModel, InjectTableQueryModel } from '../../core/table/adapters/index.js'
import { InjectShareRepository } from '../adapters/share-sqlite.repository.js'

@QueryHandler(GetShareViewRecordsQuery)
export class NestGetShareViewRecordsQueryHandler
  extends GetShareViewRecordsQueryHandler
  implements IQueryHandler<GetShareViewRecordsQuery, IGetShareViewRecordsOutput>
{
  constructor(
    @InjectShareRepository()
    protected readonly shareRepo: IShareRepository,
    @InjectTableQueryModel()
    protected readonly tableRepo: ITableQueryModel,
    @InjectRecordQueryModel()
    protected readonly rm: IRecordQueryModel,
  ) {
    super(shareRepo, tableRepo, rm)
  }
}
