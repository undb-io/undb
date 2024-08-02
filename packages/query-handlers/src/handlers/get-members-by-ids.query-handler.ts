import { injectSpaceMemberQueryRepository, type ISpaceMemberDTO, type ISpaceMemberQueryRepository } from "@undb/authz"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type IQueryHandler } from "@undb/domain"
import { GetMembersByIdsQuery } from "@undb/queries"

@queryHandler(GetMembersByIdsQuery)
@singleton()
export class GetMembersByIdsQueryHandler implements IQueryHandler<GetMembersByIdsQuery, any> {
  constructor(
    @injectSpaceMemberQueryRepository()
    private readonly repo: ISpaceMemberQueryRepository,
  ) {}

  async execute(query: GetMembersByIdsQuery): Promise<ISpaceMemberDTO[]> {
    return this.repo.findByIds(query.ids)
  }
}
