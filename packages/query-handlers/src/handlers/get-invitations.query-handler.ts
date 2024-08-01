import {
  injectInvitationQueryRepository,
  InvitationCompositeSpecification,
  WithStatus,
  type IInvitationQueryRepository,
  type InvitationDTO,
} from "@undb/authz"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { and, type IQueryHandler } from "@undb/domain"
import { GetInivitationsQuery } from "@undb/queries"

@queryHandler(GetInivitationsQuery)
@singleton()
export class GetInivitationsQueryHandler implements IQueryHandler<GetInivitationsQuery, any> {
  constructor(
    @injectInvitationQueryRepository()
    private readonly repo: IInvitationQueryRepository,
  ) {}

  async execute(query: GetInivitationsQuery): Promise<InvitationDTO[]> {
    const specs: InvitationCompositeSpecification[] = []
    if (query.status) {
      specs.push(new WithStatus(query.status))
    }

    const spec = and(...specs)
    const invitations = await this.repo.find(spec)

    return invitations
  }
}
