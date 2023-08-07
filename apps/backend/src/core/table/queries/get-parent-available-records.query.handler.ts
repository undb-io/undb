import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { type IRecordQueryModel, type ITableRepository } from '@undb/core'
import type { IGetParentAvailableRecordsOutput } from '@undb/cqrs'
import { GetParentAvailableRecordsQuery, GetParentAvailableRecordsQueryHandler } from '@undb/cqrs'
import { ClsService } from 'nestjs-cls'
import { InjectRecordQueryModel } from '../adapters/sqlite/record-sqlite.query-model.js'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@QueryHandler(GetParentAvailableRecordsQuery)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class NestGetParentAvailableRecordsQueryHandler
  extends GetParentAvailableRecordsQueryHandler
  implements IQueryHandler<GetParentAvailableRecordsQuery, IGetParentAvailableRecordsOutput>
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
