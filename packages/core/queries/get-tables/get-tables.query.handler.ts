import type { IQueryHandler } from '@egodb/domain'
import type { ITableQueryModel } from '../../table.query-model.js'
import type { IGetTablesOutput } from './get-tables.query.interface.js'
import type { GetTablesQuery } from './get-tables.query.js'

export class GetTablesQueryHandler implements IQueryHandler<GetTablesQuery, IGetTablesOutput> {
  constructor(protected readonly rm: ITableQueryModel) {}

  async execute(query: GetTablesQuery): Promise<IGetTablesOutput> {
    const tables = await this.rm.find()

    return tables
  }
}
