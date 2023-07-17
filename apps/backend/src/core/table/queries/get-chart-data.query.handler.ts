import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRecordAggregateRepository, type ITableRepository } from '@undb/core'
import type { IGetChartDataOutput } from '@undb/cqrs'
import { GetChartDataQueryHandler as DomainHandler, GetChartDataQuery } from '@undb/cqrs'
import { InjectRecordAggregateRepositoy } from '../adapters/sqlite/record-sqlite.aggregate-repository.js'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@QueryHandler(GetChartDataQuery)
export class NestGetChartDataQueryHandler
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
