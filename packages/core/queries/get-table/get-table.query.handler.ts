import type { IQueryHandler } from '@egodb/domain'
import type { ITableQueryModel } from '../../query-model'
import type { GetTableQuery } from './get-table.query'
import type { IGetTableOutput } from './get-table.query.interface'

export class GetTableQueryHandler implements IQueryHandler<GetTableQuery, IGetTableOutput> {
  constructor(protected readonly rm: ITableQueryModel) {}

  async execute(query: GetTableQuery): Promise<IGetTableOutput> {
    const table = (await this.rm.findOneById(query.id)).unwrap()

    return { id: table.id, name: table.name, columns: table.columns }
  }
}
