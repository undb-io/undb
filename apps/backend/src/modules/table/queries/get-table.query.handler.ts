import { type ITableQueryModel } from '@egodb/core'
import type { IGetTableOutput } from '@egodb/cqrs'
import { GetTableQuery, GetTableQueryHandler as DomainHandler } from '@egodb/cqrs'
import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { InjectTableQueryModel } from '../adapters/index.js'

@QueryHandler(GetTableQuery)
export class NestGetTableQueryHandelr extends DomainHandler implements IQueryHandler<GetTableQuery, IGetTableOutput> {
  constructor(
    @InjectTableQueryModel()
    protected readonly rm: ITableQueryModel,
  ) {
    super(rm)
  }
}
