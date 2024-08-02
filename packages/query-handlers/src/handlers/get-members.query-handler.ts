import {
  SpaceMemberComositeSpecification,
  WithSpaceMemberQ,
  injectSpaceMemberQueryRepository,
  type ISpaceMemberDTO,
  type ISpaceMemberQueryRepository,
} from "@undb/authz"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { None, Option, Some, type IQueryHandler } from "@undb/domain"
import { GetMembersQuery } from "@undb/queries"

@queryHandler(GetMembersQuery)
@singleton()
export class GetMembersQueryHandler implements IQueryHandler<GetMembersQuery, any> {
  constructor(
    @injectSpaceMemberQueryRepository()
    private readonly repo: ISpaceMemberQueryRepository,
  ) {}

  async execute(query: GetMembersQuery): Promise<ISpaceMemberDTO[]> {
    let spec: Option<SpaceMemberComositeSpecification> = None
    if (query.q) {
      spec = Some(new WithSpaceMemberQ(query.q))
    }

    return this.repo.find(spec)
  }
}
