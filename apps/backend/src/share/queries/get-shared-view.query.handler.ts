import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRecordQueryModel, type ITableQueryModel } from '@undb/core'
import type { IGetSharedViewOutput } from '@undb/cqrs'
import { GetSharedViewQuery, GetSharedViewQueryHandler } from '@undb/cqrs'
import { type IShareRepository } from '@undb/integrations'
import { InjectRecordQueryModel, InjectTableRepository } from '../../core/table/adapters/index.js'
import { InjectShareRepository } from '../adapters/share-sqlite.repository.js'

@QueryHandler(GetSharedViewQuery)
export class NestGetSharedViewQueryHandler
  extends GetSharedViewQueryHandler
  implements IQueryHandler<GetSharedViewQuery, IGetSharedViewOutput>
{
  constructor(
    @InjectShareRepository()
    protected readonly shareRepo: IShareRepository,
    @InjectTableRepository()
    protected readonly tableQueryModel: ITableQueryModel,
    @InjectRecordQueryModel()
    protected readonly rm: IRecordQueryModel,
  ) {
    super(shareRepo, tableQueryModel, rm)
  }
}
