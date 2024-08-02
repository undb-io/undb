import { injectSpaceMemberQueryRepository, type ISpaceMemberDTO, type ISpaceMemberQueryRepository } from "@undb/authz"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type IQueryHandler } from "@undb/domain"
import { GetMemberByIdQuery } from "@undb/queries"

@queryHandler(GetMemberByIdQuery)
@singleton()
export class GetMemberByIdQueryHandler implements IQueryHandler<GetMemberByIdQuery, any> {
  constructor(
    @injectSpaceMemberQueryRepository()
    private readonly repo: ISpaceMemberQueryRepository,
  ) {}

  async execute(query: GetMemberByIdQuery): Promise<ISpaceMemberDTO> {
    return (await this.repo.findOneById(query.id)).unwrap()
  }
}
