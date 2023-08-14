import { QueryHandler } from '@nestjs/cqrs'
import { GetInvitationsQuery, GetInvitationsQueryHandler } from '@undb/cqrs'
import { type IInvitationQueryModel } from '@undb/integrations'
import { InjectInvitationQueryModel } from '../adapters/invitation-sqlite.query-model.js'

@QueryHandler(GetInvitationsQuery)
export class NestGetInvitationsQueryHandler extends GetInvitationsQueryHandler {
  constructor(
    @InjectInvitationQueryModel()
    protected readonly rm: IInvitationQueryModel,
  ) {
    super(rm)
  }
}
