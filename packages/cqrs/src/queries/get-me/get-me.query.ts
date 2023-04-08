import { IQueryUser } from '@egodb/core'
import { Query } from '@egodb/domain'
import type { IGetMeQuery } from './get-me.query.interface.js'

export class GetMeQuery extends Query implements IGetMeQuery {
  public readonly me: IQueryUser

  constructor(query: IGetMeQuery) {
    super()
    this.me = query.me
  }
}
