import {
  injectWorkspaceMemberQueryRepository,
  type IWorkspaceMemberDTO,
  type IWorkspaceMemberQueryRepository,
} from "@undb/authz"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type IQueryHandler } from "@undb/domain"
import { GetMembersByIdsQuery } from "@undb/queries"

@queryHandler(GetMembersByIdsQuery)
@singleton()
export class GetMembersByIdsQueryHandler implements IQueryHandler<GetMembersByIdsQuery, any> {
  constructor(
    @injectWorkspaceMemberQueryRepository()
    private readonly repo: IWorkspaceMemberQueryRepository,
  ) {}

  async execute(query: GetMembersByIdsQuery): Promise<IWorkspaceMemberDTO[]> {
    return this.repo.findByIds(query.ids)
  }
}
