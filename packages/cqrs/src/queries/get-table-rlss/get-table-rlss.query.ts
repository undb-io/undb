import { Query } from '@undb/domain'
import type { IGetTableRLSSQuery } from './get-table-rlss.query.interface.js'

export class GetTableRLSSQuery extends Query implements IGetTableRLSSQuery {
  public readonly tableId: string

  constructor(query: IGetTableRLSSQuery) {
    super()
    this.tableId = query.tableId
  }
}
