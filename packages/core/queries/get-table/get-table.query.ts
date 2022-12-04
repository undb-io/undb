import { Query } from '@egodb/domain/dist'
import type { IGetTableQuery } from './get-table.query.interface'

export class GetTableQuery extends Query {
  public readonly id: string

  constructor(query: IGetTableQuery) {
    super()
    this.id = query.id
  }
}
