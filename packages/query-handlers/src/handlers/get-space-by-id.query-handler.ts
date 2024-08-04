import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { Option, type IQueryHandler } from "@undb/domain"
import { GetSpaceByIdQuery } from "@undb/queries"
import { injectSpaceQueryRepository, type ISpaceDTO, type ISpaceQueryRepository } from "@undb/space"

@queryHandler(GetSpaceByIdQuery)
@singleton()
export class GetSpaceByIdQueryHandler implements IQueryHandler<GetSpaceByIdQuery, any> {
  constructor(
    @injectSpaceQueryRepository()
    private readonly repo: ISpaceQueryRepository,
  ) {}

  async execute(query: GetSpaceByIdQuery): Promise<Option<ISpaceDTO>> {
    return this.repo.findOneById(query.id)
  }
}
