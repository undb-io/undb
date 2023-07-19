import { Query } from '@undb/domain'
import type { IGetUsersQuery } from './get-users.query.interface.js'

export class GetUsersQuery extends Query implements IGetUsersQuery {
  public readonly id?: string
  public readonly ids?: string[]

  constructor(query: IGetUsersQuery) {
    super()
    this.id = query.id
    this.ids = query.ids
  }
}
