import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type ITableQueryModel } from '@undb/core'
import type { IGetTableOutput } from '@undb/cqrs'
import { GetTableQueryHandler as DomainHandler, GetTableQuery } from '@undb/cqrs'
import { InjectTableQueryModel } from '../adapters/sqlite/table-sqlite.query-model.js'

@QueryHandler(GetTableQuery)
export class NestGetTableQueryHandler extends DomainHandler implements IQueryHandler<GetTableQuery, IGetTableOutput> {
  constructor(
    @InjectTableQueryModel()
    protected readonly rm: ITableQueryModel,
  ) {
    super(rm)
  }
}
