import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { type IRecordQueryModel, type ITableRepository } from '@undb/core'
import type { IGetForeignRecordsOutput } from '@undb/cqrs'
import { GetForeignRecordsQuery, GetForeignRecordsQueryHandler } from '@undb/cqrs'
import { ClsService } from 'nestjs-cls'
import { InjectRecordQueryModel } from '../adapters/sqlite/record-sqlite.query-model.js'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@QueryHandler(GetForeignRecordsQuery)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class NestGetForeignRecordsQueryHandler
  extends GetForeignRecordsQueryHandler
  implements IQueryHandler<GetForeignRecordsQuery, IGetForeignRecordsOutput>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordQueryModel()
    protected readonly rm: IRecordQueryModel,
    protected readonly cls: ClsService<ClsStore>,
  ) {
    super(tableRepo, rm, cls as IClsService<ClsStore>)
  }
}
