import {
  WithWorkspaceMemberQ,
  WorkspaceMemberComositeSpecification,
  injectWorkspaceMemberQueryRepository,
  type IWorkspaceMemberDTO,
  type IWorkspaceMemberQueryRepository,
} from "@undb/authz"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { None, Option, Some, type IQueryHandler } from "@undb/domain"
import { GetMembersQuery } from "@undb/queries"

@queryHandler(GetMembersQuery)
@singleton()
export class GetMembersQueryHandler implements IQueryHandler<GetMembersQuery, any> {
  constructor(
    @injectWorkspaceMemberQueryRepository()
    private readonly repo: IWorkspaceMemberQueryRepository,
  ) {}

  async execute(query: GetMembersQuery): Promise<IWorkspaceMemberDTO[]> {
    let spec: Option<WorkspaceMemberComositeSpecification> = None
    if (query.q) {
      spec = Some(new WithWorkspaceMemberQ(query.q))
    }

    return this.repo.find(spec)
  }
}
