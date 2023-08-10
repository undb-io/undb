import { QueryHandler } from '@nestjs/cqrs'
import { type IMemberQueryModel } from '@undb/authz'
import { GetMembersQuery, GetMembersQueryHandler } from '@undb/cqrs'
import { InjectMemberQueryModel } from '../adapters/member-sqlite.query-model.js'

@QueryHandler(GetMembersQuery)
export class NestGetMembersQueryHandler extends GetMembersQueryHandler {
  constructor(
    @InjectMemberQueryModel()
    protected readonly rm: IMemberQueryModel,
  ) {
    super(rm)
  }
}
