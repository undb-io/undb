import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRecordAggregateRepository, type ITableQueryModel } from '@undb/core'
import type { IGetShareAggregateNumberOutput } from '@undb/cqrs'
import { GetShareAggregateNumberQueryHandler as DomainHandler, GetShareAggregateNumberQuery } from '@undb/cqrs'
import { InjectRecordAggregateRepositoy, InjectTableQueryModel } from '../../core/table/adapters/index.js'
import { NestShareGuardService } from '../services/share-guard.service.js'

@QueryHandler(GetShareAggregateNumberQuery)
export class NestGetShareAggregateNumberQueryHandler
  extends DomainHandler
  implements IQueryHandler<GetShareAggregateNumberQuery, IGetShareAggregateNumberOutput>
{
  constructor(
    protected readonly guard: NestShareGuardService,
    @InjectTableQueryModel()
    protected readonly tableQueryModel: ITableQueryModel,
    @InjectRecordAggregateRepositoy()
    protected readonly repo: IRecordAggregateRepository,
  ) {
    super(guard, tableQueryModel, repo)
  }
}
