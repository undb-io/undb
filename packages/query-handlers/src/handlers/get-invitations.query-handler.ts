import { injectInvitationQueryRepository, type IInvitationQueryRepository, type InvitationDTO } from "@undb/authz"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type IQueryHandler } from "@undb/domain"
import { GetInivitationsQuery } from "@undb/queries"

@queryHandler(GetInivitationsQuery)
@singleton()
export class GetInivitationsQueryHandler implements IQueryHandler<GetInivitationsQuery, any> {
  constructor(
    @injectInvitationQueryRepository()
    private readonly repo: IInvitationQueryRepository,
  ) {}

  async execute(query: GetInivitationsQuery): Promise<InvitationDTO[]> {
    return this.repo.find()
  }
}
