import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type ITableQueryModel } from '@undb/core'
import type { IGetTablesOutput } from '@undb/cqrs'
import { GetTablesQuery, GetTablesQueryHandler } from '@undb/cqrs'
import { InjectTableQueryModel } from '../adapters/sqlite/table-sqlite.query-model.js'

@QueryHandler(GetTablesQuery)
export class NestGetTablesQueryHandler
  extends GetTablesQueryHandler
  implements IQueryHandler<GetTablesQuery, IGetTablesOutput>
{
  constructor(
    @InjectTableQueryModel()
    protected readonly rm: ITableQueryModel,
  ) {
    super(rm)
  }
}
