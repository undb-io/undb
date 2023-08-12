import { Query } from '@undb/domain'
import type { IGetInvitationsQuery } from './get-invitations.query.interface.js'

export class GetInvitationsQuery extends Query {
  constructor(query: IGetInvitationsQuery) {
    super()
  }
}
