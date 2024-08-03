import {
  SpaceMemberComositeSpecification,
  WithSpaceMemberQ,
  WithSpaceMemberSpaceId,
  injectSpaceMemberQueryRepository,
  type ISpaceMemberDTO,
  type ISpaceMemberQueryRepository,
} from "@undb/authz"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { and, type IQueryHandler } from "@undb/domain"
import { GetMembersQuery } from "@undb/queries"

@queryHandler(GetMembersQuery)
@singleton()
export class GetMembersQueryHandler implements IQueryHandler<GetMembersQuery, any> {
  constructor(
    @injectSpaceMemberQueryRepository()
    private readonly repo: ISpaceMemberQueryRepository,
  ) {}

  async execute(query: GetMembersQuery): Promise<ISpaceMemberDTO[]> {
    let specs: SpaceMemberComositeSpecification[] = []

    specs.push(new WithSpaceMemberSpaceId(query.spaceId))
    if (query.q) {
      specs.push(new WithSpaceMemberQ(query.q))
    }

    return this.repo.find(and(...specs))
  }
}
