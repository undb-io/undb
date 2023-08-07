import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { type IRecordQueryModel, type ITableRepository } from '@undb/core'
import type { IGetTrashRecordsOutput } from '@undb/cqrs'
import { GetTrashRecordsQuery, GetTrashRecordsQueryHandler } from '@undb/cqrs'
import { ClsService } from 'nestjs-cls'
import { NestRLSAuthzService } from '../../../authz/rls/rls-authz.service.js'
import { InjectRecordQueryModel } from '../adapters/sqlite/record-sqlite.query-model.js'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@QueryHandler(GetTrashRecordsQuery)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class NestGetTrashRecordsQueryHandler
  extends GetTrashRecordsQueryHandler
  implements IQueryHandler<GetTrashRecordsQuery, IGetTrashRecordsOutput>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordQueryModel()
    protected readonly rm: IRecordQueryModel,
    protected readonly cls: ClsService<ClsStore>,
    protected readonly rls: NestRLSAuthzService,
  ) {
    super(tableRepo, rm, cls as IClsService<ClsStore>, rls)
  }
}
