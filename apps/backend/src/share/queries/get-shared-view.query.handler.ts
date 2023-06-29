import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type ITableQueryModel } from '@undb/core'
import type { IGetSharedViewOutput } from '@undb/cqrs'
import { GetSharedViewQuery, GetSharedViewQueryHandler } from '@undb/cqrs'
import { type IShareRepository } from '@undb/integrations'
import { InjectTableQueryModel } from '../../core/table/adapters/index.js'
import { InjectShareRepository } from '../adapters/share-sqlite.repository.js'

@QueryHandler(GetSharedViewQuery)
export class NestGetSharedViewQueryHandler
  extends GetSharedViewQueryHandler
  implements IQueryHandler<GetSharedViewQuery, IGetSharedViewOutput>
{
  constructor(
    @InjectShareRepository()
    protected readonly shareRepo: IShareRepository,
    @InjectTableQueryModel()
    protected readonly tableQueryModel: ITableQueryModel,
  ) {
    super(shareRepo, tableQueryModel)
  }
}
