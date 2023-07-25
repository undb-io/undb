import type { IQueryHandler } from '@undb/domain'
import { WithAuditTarget, type IAuditQueryModel } from '@undb/integrations'
import type { IGetRecordAuditsOutput } from './get-record-audits.query.interface.js'
import type { GetRecordAuditsQuery } from './get-record-audits.query.js'

export class GetRecordAuditsQueryHandler implements IQueryHandler<GetRecordAuditsQuery, IGetRecordAuditsOutput> {
  constructor(protected readonly rm: IAuditQueryModel) {}

  async execute(query: GetRecordAuditsQuery): Promise<IGetRecordAuditsOutput> {
    const spec = WithAuditTarget.fromRecordId(query.recordId)

    const audits = await this.rm.find(spec)

    return {
      audits: audits.map(({ target, ...audit }) => audit),
    }
  }
}
