import type { IFLSQueryService, IRLSQueryService } from '@undb/authz'
import { type ITableQueryModel } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IGetTableOutput } from './get-table.query.interface.js'
import type { GetTableQuery } from './get-table.query.js'

export class GetTableQueryHandler implements IQueryHandler<GetTableQuery, IGetTableOutput> {
  constructor(
    protected readonly rm: ITableQueryModel,
    protected readonly rlsrs: IRLSQueryService,
    protected readonly flsrs: IFLSQueryService,
  ) {}

  async execute(query: GetTableQuery): Promise<IGetTableOutput> {
    const table = (await this.rm.findOneById(query.id)).into()
    if (!table) {
      return {
        table,
        rlss: [],
        flss: [],
      }
    }

    const [rlss, flss] = await Promise.all([this.rlsrs.findTableRLSS(table.id), this.flsrs.findTableFLSS(table.id)])

    return {
      table,
      rlss,
      flss,
    }
  }
}
