import { Query } from '@undb/domain'
import type { IGetTableQuery } from './get-table.query.interface.js'

export class GetTableQuery extends Query {
  public readonly id: string

  constructor(query: IGetTableQuery) {
    super()
    this.id = query.id
  }
}
