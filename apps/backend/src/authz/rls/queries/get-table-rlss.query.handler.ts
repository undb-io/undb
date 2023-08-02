import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRLSQueryModel } from '@undb/authz'
import type { IGetTableRLSSOutput } from '@undb/cqrs'
import { GetTableRLSSQuery, GetTableRLSSQueryHandler } from '@undb/cqrs'
import { InjectRLSQueryModel } from '../adapters/rls-sqlite.query-model.js'

@QueryHandler(GetTableRLSSQuery)
export class NestGetTableRLSSQueryHandler
  extends GetTableRLSSQueryHandler
  implements IQueryHandler<GetTableRLSSQuery, IGetTableRLSSOutput>
{
  constructor(
    @InjectRLSQueryModel()
    protected readonly qm: IRLSQueryModel,
  ) {
    super(qm)
  }
}
