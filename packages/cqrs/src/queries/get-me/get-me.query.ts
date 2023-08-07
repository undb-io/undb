import type { IQueryUser } from '@undb/core'
import { Query } from '@undb/domain'
import type { IGetMeQuery } from './get-me.query.interface.js'

export class GetMeQuery extends Query implements IGetMeQuery {
  public readonly me: IQueryUser

  constructor(query: IGetMeQuery) {
    super()
    this.me = query.me
  }
}
