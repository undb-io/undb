import type { IGetTableOutput } from '@egodb/core'
import { GetTableQuery, GetTableQueryHandler as DomainHandler, ITableQueryModel } from '@egodb/core'
import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { InjectTableQueryModel } from '../adapters/in-memory'

@QueryHandler(GetTableQuery)
export class NestGetTableQueryHandelr extends DomainHandler implements IQueryHandler<GetTableQuery, IGetTableOutput> {
  constructor(
    @InjectTableQueryModel()
    protected readonly rm: ITableQueryModel,
  ) {
    super(rm)
  }
}
