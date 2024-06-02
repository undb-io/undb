import { AuditService, type IAuditService } from "@undb/audit"
import { queryHandler } from "@undb/cqrs"
import { inject, singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetRecordAuditsQuery, type IGetRecordAuditsOutput, type IGetRecordAuditsQuery } from "@undb/queries"
import { RecordIdVO } from "@undb/table"

@queryHandler(GetRecordAuditsQuery)
@singleton()
export class GetRecordAuditsQueryHandler implements IQueryHandler<IGetRecordAuditsQuery, IGetRecordAuditsOutput> {
  constructor(
    @inject(AuditService)
    private readonly svc: IAuditService,
  ) {}

  async execute(query: IGetRecordAuditsQuery): Promise<IGetRecordAuditsOutput> {
    const audits = await this.svc.getRecordAudits(new RecordIdVO(query.recordId))

    return {
      total: audits.length,
      audits: audits,
    }
  }
}
