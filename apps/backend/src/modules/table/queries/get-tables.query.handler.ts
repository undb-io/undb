import type { IGetTablesOutput } from '@egodb/core'
import { GetTablesQuery, GetTablesQueryHandler, ITableQueryModel } from '@egodb/core'
import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { InjectTableQueryModel } from '../adapters/in-memory'

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
