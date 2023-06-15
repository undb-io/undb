import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import type { IRecordAggregateRepository, ITableRepository } from '@undb/core'
import type { IAggregateNumberOutput } from '@undb/cqrs'
import { AggregateNumberQuery, AggregateNumberQueryHandler as DomainHandler } from '@undb/cqrs'
import { InjectRecordAggregateRepositoy, InjectTableRepository } from '../adapters/index.js'

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
