import { Query } from '@undb/domain'
import type { IGetMembersQuery } from './get-members.query.interface.js'

export class GetMembersQuery extends Query {
  constructor(query: IGetMembersQuery) {
    super()
  }
}
