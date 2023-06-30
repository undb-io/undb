import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type ITableQueryModel } from '@undb/core'
import type { IGetSharedViewOutput } from '@undb/cqrs'
import { GetSharedViewQuery, GetSharedViewQueryHandler } from '@undb/cqrs'
import { InjectTableQueryModel } from '../../core/table/adapters/index.js'
import { NestShareGuardService } from '../services/share-guard.service.js'

@QueryHandler(GetSharedViewQuery)
export class NestGetSharedViewQueryHandler
  extends GetSharedViewQueryHandler
  implements IQueryHandler<GetSharedViewQuery, IGetSharedViewOutput>
{
  constructor(
    guard: NestShareGuardService,
    @InjectTableQueryModel()
    protected readonly tableQueryModel: ITableQueryModel,
  ) {
    super(guard, tableQueryModel)
  }
}
