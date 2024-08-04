import {
  injectSpaceMemberQueryRepository,
  WithSpaceMemberSpaceId,
  type ISpaceMemberDTO,
  type ISpaceMemberQueryRepository,
} from "@undb/authz"
import { WithSpaceMemberUserId } from "@undb/authz/src/space-member/specifications/space-member-user-id.specification"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { Option, type IQueryHandler } from "@undb/domain"
import { GetSpaceMemberQuery } from "@undb/queries"

@queryHandler(GetSpaceMemberQuery)
@singleton()
export class GetSpaceMemberQueryHandler implements IQueryHandler<GetSpaceMemberQuery, any> {
  constructor(
    @injectSpaceMemberQueryRepository()
    private readonly repo: ISpaceMemberQueryRepository,
  ) {}

  async execute(query: GetSpaceMemberQuery): Promise<Option<ISpaceMemberDTO>> {
    const spec = new WithSpaceMemberSpaceId(query.spaceId).and(new WithSpaceMemberUserId(query.userId))

    return this.repo.findOne(spec)
  }
}
