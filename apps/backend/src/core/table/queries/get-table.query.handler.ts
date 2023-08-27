import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type ITableQueryModel } from '@undb/core'
import type { IGetTableOutput } from '@undb/cqrs'
import { GetTableQueryHandler as DomainHandler, GetTableQuery } from '@undb/cqrs'
import { NestFLSQueryService } from '../../../authz/fls/fls-query.service.js'
import { NestRLSQueryService } from '../../../authz/rls/rls-query.service.js'
import { InjectTableQueryModel } from '../adapters/sqlite/table-sqlite.query-model.js'

@QueryHandler(GetTableQuery)
export class NestGetTableQueryHandler extends DomainHandler implements IQueryHandler<GetTableQuery, IGetTableOutput> {
  constructor(
    @InjectTableQueryModel()
    protected readonly rm: ITableQueryModel,
    protected readonly rlsrs: NestRLSQueryService,
    protected readonly flsrs: NestFLSQueryService,
  ) {
    super(rm, rlsrs, flsrs)
  }
}
