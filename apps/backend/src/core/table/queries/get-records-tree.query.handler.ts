import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { type IRecordTreeQueryModel, type ITableRepository } from '@undb/core'
import type { IGetRecordsTreeOutput } from '@undb/cqrs'
import { GetRecordsTreeQuery, GetRecordsTreeQueryHandler } from '@undb/cqrs'
import { ClsService } from 'nestjs-cls'
import { InjectRecordTreeQueryModel } from '../adapters/sqlite/record-sqlite.tree-query-model.js'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@QueryHandler(GetRecordsTreeQuery)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class NestGetRecordsTreeQueryHandler
  extends GetRecordsTreeQueryHandler
  implements IQueryHandler<GetRecordsTreeQuery, IGetRecordsTreeOutput>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordTreeQueryModel()
    protected readonly rm: IRecordTreeQueryModel,
    protected readonly cls: ClsService<ClsStore>,
  ) {
    super(tableRepo, rm, cls as IClsService<ClsStore>)
  }
}
