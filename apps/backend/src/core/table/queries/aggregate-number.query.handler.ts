import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRecordAggregateRepository, type ITableRepository } from '@undb/core'
import type { IAggregateNumberOutput } from '@undb/cqrs'
import { AggregateNumberQuery, AggregateNumberQueryHandler as DomainHandler } from '@undb/cqrs'
import { InjectRecordAggregateRepositoy } from '../adapters/sqlite/record-sqlite.aggregate-repository.js'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@QueryHandler(AggregateNumberQuery)
export class NestAggregateNumberQueryHandler
  extends DomainHandler
  implements IQueryHandler<AggregateNumberQuery, IAggregateNumberOutput>
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
