import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { type IRecordQueryModel, type ITableRepository } from '@undb/core'
import type { IGetRecordsOutput } from '@undb/cqrs'
import { GetRecordsQuery, GetRecordsQueryHandler } from '@undb/cqrs'
import { ClsService } from 'nestjs-cls'
import { NestRLSRecordSpecService } from '../../../authz/rls/rls-record-spec.service.js'
import { InjectRecordQueryModel } from '../adapters/sqlite/record-sqlite.query-model.js'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@QueryHandler(GetRecordsQuery)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class NestGetRecordsQueryHandler
  extends GetRecordsQueryHandler
  implements IQueryHandler<GetRecordsQuery, IGetRecordsOutput>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordQueryModel()
    protected readonly rm: IRecordQueryModel,
    protected readonly cls: ClsService<ClsStore>,
    protected readonly rls: NestRLSRecordSpecService,
  ) {
    super(tableRepo, rm, cls as IClsService<ClsStore>, rls)
  }
}
