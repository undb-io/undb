import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import type { IGetRecordAuditsOutput } from '@undb/cqrs'
import { GetRecordAuditsQuery, GetRecordAuditsQueryHandler } from '@undb/cqrs'
import { type IAuditQueryModel } from '@undb/integrations'
import { InjectAuditQueryModel } from '../adapters/audit-sqlite.query-model.js'

@QueryHandler(GetRecordAuditsQuery)
export class NestGetRecordAuditsQueryHandler
  extends GetRecordAuditsQueryHandler
  implements IQueryHandler<GetRecordAuditsQuery, IGetRecordAuditsOutput>
{
  constructor(
    @InjectAuditQueryModel()
    protected readonly rm: IAuditQueryModel,
  ) {
    super(rm)
  }
}
