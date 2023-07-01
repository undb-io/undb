import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRecordAggregateRepository, type ITableQueryModel } from '@undb/core'
import type { IGetShareAggregateChartOutput } from '@undb/cqrs'
import { GetShareAggregateChartQueryHandler as DomainHandler, GetShareAggregateChartQuery } from '@undb/cqrs'
import { InjectRecordAggregateRepositoy, InjectTableQueryModel } from '../../core/table/adapters/index.js'
import { NestShareGuardService } from '../services/share-guard.service.js'

@QueryHandler(GetShareAggregateChartQuery)
export class NestGetShareAggregateChartQueryHandler
  extends DomainHandler
  implements IQueryHandler<GetShareAggregateChartQuery, IGetShareAggregateChartOutput>
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
