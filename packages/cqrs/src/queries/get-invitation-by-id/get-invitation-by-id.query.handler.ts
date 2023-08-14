import type { IQueryHandler } from '@undb/domain'
import { type IInvitationQueryModel } from '@undb/integrations'
import type { IGetInvitationByIdOutput } from './get-invitation-by-id.query.interface.js'
import type { GetInvitationByIdQuery } from './get-invitation-by-id.query.js'

export class GetInvitationByIdQueryHandler implements IQueryHandler<GetInvitationByIdQuery, IGetInvitationByIdOutput> {
  constructor(protected readonly rm: IInvitationQueryModel) {}
  async execute(query: GetInvitationByIdQuery): Promise<IGetInvitationByIdOutput> {
    const invitation = await this.rm.findOneById(query.id)

    return {
      invitation: invitation.into(),
    }
  }
}
