import type { TableCompositeSpecification } from '@undb/core'
import { WithTableBaseId, type ITableQueryModel } from '@undb/core'
import { and, type IQueryHandler } from '@undb/domain'
import type { IGetTablesOutput } from './get-tables.query.interface.js'
import type { GetTablesQuery } from './get-tables.query.js'

export class GetTablesQueryHandler implements IQueryHandler<GetTablesQuery, IGetTablesOutput> {
  constructor(protected readonly rm: ITableQueryModel) {}

  async execute(query: GetTablesQuery): Promise<IGetTablesOutput> {
    const specs: TableCompositeSpecification[] = []

    if (query.baseId) {
      specs.push(WithTableBaseId.fromString(query.baseId))
    }

    const spec = and(...specs)

    const tables = await this.rm.find(spec)

    return tables
  }
}
