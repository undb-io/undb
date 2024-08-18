import { injectBaseQueryRepository, WithBaseSpaceId, type IBaseDTO, type IBaseQueryRepository } from "@undb/base"
import { mustGetCurrentSpaceId } from "@undb/context/server"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { Some, type IQueryHandler } from "@undb/domain"
import { GetBasesQuery } from "@undb/queries"

@queryHandler(GetBasesQuery)
@singleton()
export class GetBasesQueryHandler implements IQueryHandler<GetBasesQuery, any> {
  constructor(
    @injectBaseQueryRepository()
    private readonly repo: IBaseQueryRepository,
  ) {}

  async execute(query: GetBasesQuery): Promise<IBaseDTO[]> {
    const spec = new WithBaseSpaceId(mustGetCurrentSpaceId())
    return this.repo.find(Some(spec))
  }
}
