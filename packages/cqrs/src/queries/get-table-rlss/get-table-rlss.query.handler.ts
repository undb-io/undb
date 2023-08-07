import { withTableRLS, type IRLSQueryModel } from '@undb/authz'
import type { IQueryHandler } from '@undb/domain'
import type { IGetTableRLSSOutput } from './get-table-rlss.query.interface.js'
import type { GetTableRLSSQuery } from './get-table-rlss.query.js'

export class GetTableRLSSQueryHandler implements IQueryHandler<GetTableRLSSQuery, IGetTableRLSSOutput> {
  constructor(protected readonly rm: IRLSQueryModel) {}

  async execute(query: GetTableRLSSQuery): Promise<IGetTableRLSSOutput> {
    const spec = withTableRLS(query.tableId)
    const rlss = await this.rm.find(spec)

    return {
      rlss,
    }
  }
}
