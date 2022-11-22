import { IGetTableQuery } from './get-table.query.interface'

export class GetTableQuery implements IGetTableQuery {
  public readonly id: string

  constructor(query: IGetTableQuery) {
    this.id = query.id
  }
}
