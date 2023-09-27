import { Query } from '@undb/domain'
import type { IGetTablesQuery } from './get-tables.query.interface'

export class GetTablesQuery extends Query implements IGetTablesQuery {
  public readonly baseId?: string
  constructor(query: IGetTablesQuery) {
    super()

    this.baseId = query.baseId
  }
}
