import type { IQueryHandler } from '@undb/domain'
import type { IInvitationQueryModel } from '@undb/integrations'
import type { IGetInvitationsOutput } from './get-invitations.query.interface.js'
import type { GetInvitationsQuery } from './get-invitations.query.js'

export class GetInvitationsQueryHandler implements IQueryHandler<GetInvitationsQuery, IGetInvitationsOutput> {
  constructor(protected readonly rm: IInvitationQueryModel) {}
  async execute(query: GetInvitationsQuery): Promise<IGetInvitationsOutput> {
    const invitations = await this.rm.find()

    return {
      invitations,
    }
  }
}
