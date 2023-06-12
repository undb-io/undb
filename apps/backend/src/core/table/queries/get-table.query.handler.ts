import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type ITableQueryModel } from '@undb/core'
import type { IGetTableOutput } from '@undb/cqrs'
import { GetTableQueryHandler as DomainHandler, GetTableQuery } from '@undb/cqrs'
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
