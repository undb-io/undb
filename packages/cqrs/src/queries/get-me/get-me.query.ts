import { Query } from '@egodb/domain'
import type { IGetMeQuery } from './get-me.query.interface.js'

export class GetMeQuery extends Query {
  public readonly me: any

  constructor(query: IGetMeQuery) {
    super()
    this.me = query.me
  }
}
