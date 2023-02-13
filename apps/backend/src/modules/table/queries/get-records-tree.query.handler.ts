import { IRecordTreeQueryModel, ITableRepository } from '@egodb/core'
import type { IGetRecordsTreeOutput } from '@egodb/cqrs'
import { GetRecordsTreeQuery, GetRecordsTreeQueryHandler } from '@egodb/cqrs'
import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'
import { InjectRecordTreeQueryModel } from '../adapters/sqlite/record-sqlite.tree-query-model'

@QueryHandler(GetRecordsTreeQuery)
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
