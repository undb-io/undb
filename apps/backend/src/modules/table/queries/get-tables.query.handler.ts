import type { IGetTablesOutput, ITableQueryModel } from '@egodb/core'
import { GetTablesQuery, GetTablesQueryHandler } from '@egodb/core'
import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { InjectTableQueryModel } from '../adapters'

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
