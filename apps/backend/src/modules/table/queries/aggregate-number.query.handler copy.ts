import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type ITableQueryModel } from '@undb/core'
import type { IAggregateNumberOutput } from '@undb/cqrs'
import { AggregateNumberQuery, AggregateNumberQueryHandler as DomainHandler } from '@undb/cqrs'
import { InjectTableQueryModel } from '../adapters/index.js'

@QueryHandler(AggregateNumberQuery)
export class NestAggregateNumberQueryHandelr
  extends DomainHandler
  implements IQueryHandler<AggregateNumberQuery, IAggregateNumberOutput>
{
  constructor(
    @InjectTableQueryModel()
    protected readonly rm: ITableQueryModel,
  ) {
    super(rm)
  }
}
