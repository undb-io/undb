import { QueryHandler } from '@nestjs/cqrs'
import { GetInvitationByIdQuery, GetInvitationByIdQueryHandler } from '@undb/cqrs'
import { type IInvitationQueryModel } from '@undb/integrations'
import { InjectInvitationQueryModel } from '../adapters/invitation-sqlite.query-model.js'

@QueryHandler(GetInvitationByIdQuery)
export class NestGetInvitationByIdQueryHandler extends GetInvitationByIdQueryHandler {
  constructor(
    @InjectInvitationQueryModel()
    protected readonly rm: IInvitationQueryModel,
  ) {
    super(rm)
  }
}
