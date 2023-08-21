import { Query } from '@undb/domain'
import type { IGetMembersQuery } from './get-members.query.interface.js'

export class GetMembersQuery extends Query implements IGetMembersQuery {
  public readonly q?: string
  constructor(query: IGetMembersQuery) {
    super()
    this.q = query.q
  }
}
