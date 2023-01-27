import type { GetRecordsTreeQuery, IGetRecordsTreeOutput } from '@egodb/core'
import { GetRecordsQuery, GetRecordsTreeQueryHandler, IRecordTreeQueryModel, ITableRepository } from '@egodb/core'
import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'
import { InjectRecordTreeQueryModel } from '../adapters/sqlite/record-sqlite.tree-query-model'

@QueryHandler(GetRecordsQuery)
export class NestGetRecordsTreeQueryHandelr
  extends GetRecordsTreeQueryHandler
  implements IQueryHandler<GetRecordsTreeQuery, IGetRecordsTreeOutput>
{
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordTreeQueryModel()
    protected readonly rm: IRecordTreeQueryModel,
  ) {
    super(tableRepo, rm)
  }
}
