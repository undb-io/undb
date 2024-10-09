import { injectBaseQueryRepository, WithBaseSpaceId, type IBaseDTO, type IBaseQueryRepository } from "@undb/base"
import { injectContext, type IContext } from "@undb/context"
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
    @injectContext()
    private readonly context: IContext,
  ) {}

  async execute(query: GetBasesQuery): Promise<IBaseDTO[]> {
    const spaceId = this.context.mustGetCurrentSpaceId()
    const spec = new WithBaseSpaceId(spaceId)
    return this.repo.find(Some(spec))
  }
}
