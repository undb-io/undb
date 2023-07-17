import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type ITableQueryModel } from '@undb/core'
import type { IGetSharedTableOutput } from '@undb/cqrs'
import { GetSharedTableQuery, GetSharedTableQueryHandler } from '@undb/cqrs'
import { InjectTableQueryModel } from '../../core/table/adapters/sqlite/table-sqlite.query-model.js'
import { NestShareGuardService } from '../services/share-guard.service.js'

@QueryHandler(GetSharedTableQuery)
export class NestGetSharedTableQueryHandler
  extends GetSharedTableQueryHandler
  implements IQueryHandler<GetSharedTableQuery, IGetSharedTableOutput>
{
  constructor(
    guard: NestShareGuardService,
    @InjectTableQueryModel()
    protected readonly tableQueryModel: ITableQueryModel,
  ) {
    super(guard, tableQueryModel)
  }
}
