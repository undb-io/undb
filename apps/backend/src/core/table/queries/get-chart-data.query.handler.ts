import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import type { IRecordAggregateRepository, ITableRepository } from '@undb/core'
import type { IGetChartDataOutput } from '@undb/cqrs'
import { GetChartDataQueryHandler as DomainHandler, GetChartDataQuery } from '@undb/cqrs'
import { InjectRecordAggregateRepositoy, InjectTableRepository } from '../adapters/index.js'

@QueryHandler(GetChartDataQuery)
export class NestGetChartDataQueryHandelr
  extends DomainHandler
  implements IQueryHandler<GetChartDataQuery, IGetChartDataOutput>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordAggregateRepositoy()
    protected readonly repo: IRecordAggregateRepository,
  ) {
    super(tableRepo, repo)
  }
}
