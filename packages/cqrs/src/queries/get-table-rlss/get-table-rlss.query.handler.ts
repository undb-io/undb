import type { IRLSQueryModel } from '@undb/authz'
import type { IQueryHandler } from '@undb/domain'
import type { IGetTableRLSSOutput } from './get-table-rlss.query.interface.js'
import type { GetTableRLSSQuery } from './get-table-rlss.query.js'

export class GetTableRLSSQueryHandler implements IQueryHandler<GetTableRLSSQuery, IGetTableRLSSOutput> {
  constructor(protected readonly rm: IRLSQueryModel) {}

  async execute(query: GetTableRLSSQuery): Promise<IGetTableRLSSOutput> {
    throw new Error('not implemented')
    // const spec = WithAuditTarget.fromRecordId(query.recordId)

    // const audits = await this.rm.find(spec)

    // return {
    //   audits: audits.map(({ target, ...audit }) => audit),
    // }
  }
}
