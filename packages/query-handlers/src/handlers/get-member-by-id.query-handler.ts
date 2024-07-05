import {
  injectWorkspaceMemberQueryRepository,
  type IWorkspaceMemberDTO,
  type IWorkspaceMemberQueryRepository,
} from "@undb/authz"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type IQueryHandler } from "@undb/domain"
import { GetMemberByIdQuery } from "@undb/queries"

@queryHandler(GetMemberByIdQuery)
@singleton()
export class GetMemberByIdQueryHandler implements IQueryHandler<GetMemberByIdQuery, any> {
  constructor(
    @injectWorkspaceMemberQueryRepository()
    private readonly repo: IWorkspaceMemberQueryRepository,
  ) {}

  async execute(query: GetMemberByIdQuery): Promise<IWorkspaceMemberDTO> {
    return (await this.repo.findOneById(query.id)).unwrap()
  }
}
