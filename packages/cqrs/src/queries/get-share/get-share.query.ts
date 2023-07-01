import { Query } from '@undb/domain'
import type { IGetShareQuery } from './get-share.query.interface.js'

export class GetShareQuery extends Query implements IGetShareQuery {
  public readonly tableId: string
  public readonly id?: string
  public readonly targetId?: string

  constructor(query: IGetShareQuery) {
    super()
    this.tableId = query.tableId
    this.id = query.id
    this.targetId = query.targetId
  }
}
