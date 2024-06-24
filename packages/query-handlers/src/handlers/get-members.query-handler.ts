import {
  injectWorkspaceMemberQueryRepository,
  type IWorkspaceMemberDTO,
  type IWorkspaceMemberQueryRepository,
} from "@undb/authz"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type IQueryHandler } from "@undb/domain"
import { GetMembersQuery } from "@undb/queries"

@queryHandler(GetMembersQuery)
@singleton()
export class GetMembersQueryHandler implements IQueryHandler<GetMembersQuery, any> {
  constructor(
    @injectWorkspaceMemberQueryRepository()
    private readonly repo: IWorkspaceMemberQueryRepository,
  ) {}

  async execute(query: GetMembersQuery): Promise<IWorkspaceMemberDTO[]> {
    return this.repo.find()
  }
}
