import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRecordQueryModel, type ITableRepository } from '@undb/core'
import type { IGetRecordOutput } from '@undb/cqrs'
import { GetRecordQuery, GetRecordQueryHandler } from '@undb/cqrs'
import { NestRLSAuthzService } from '../../../authz/rls/rls-authz.service.js'
import { InjectRecordQueryModel } from '../adapters/sqlite/record-sqlite.query-model.js'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@QueryHandler(GetRecordQuery)
export class NestGetRecordQueryHandler
  extends GetRecordQueryHandler
  implements IQueryHandler<GetRecordQuery, IGetRecordOutput>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordQueryModel()
    protected readonly rm: IRecordQueryModel,
    protected readonly rls: NestRLSAuthzService,
  ) {
    super(tableRepo, rm, rls)
  }
}
