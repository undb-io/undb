import { Query } from '@undb/domain'
import type { IGetInvitationByIdQuery } from './get-invitation-by-id.query.interface.js'

export class GetInvitationByIdQuery extends Query {
  public readonly id: string
  constructor(query: IGetInvitationByIdQuery) {
    super()

    this.id = query.id
  }
}
