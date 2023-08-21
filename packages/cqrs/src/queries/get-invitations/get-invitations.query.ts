import { Query } from '@undb/domain'
import type { IGetInvitationsQuery } from './get-invitations.query.interface.js'

export class GetInvitationsQuery extends Query implements IGetInvitationsQuery {
  public readonly q?: string
  constructor(query: IGetInvitationsQuery) {
    super()

    this.q = query.q
  }
}
