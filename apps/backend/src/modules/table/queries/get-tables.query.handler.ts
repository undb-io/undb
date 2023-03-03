import { type ITableQueryModel } from '@egodb/core'
import type { IGetTablesOutput } from '@egodb/cqrs'
import { GetTablesQuery, GetTablesQueryHandler } from '@egodb/cqrs'
import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { InjectTableQueryModel } from '../adapters/index.js'

@QueryHandler(GetTablesQuery)
export class NestGetTablesQueryHandelr
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
