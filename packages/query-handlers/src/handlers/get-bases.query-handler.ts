import { injectBaseQueryRepository, WithBaseSpaceId, type IBaseQueryRepository } from "@undb/base"
import { injectContext, type IContext } from "@undb/context"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { Some, type IQueryHandler } from "@undb/domain"
import { GetBasesQuery, type IGetBasesQueryOutput } from "@undb/queries"

@queryHandler(GetBasesQuery)
@singleton()
export class GetBasesQueryHandler implements IQueryHandler<GetBasesQuery, IGetBasesQueryOutput> {
  constructor(
    @injectBaseQueryRepository()
    private readonly repo: IBaseQueryRepository,
    @injectContext()
    private readonly context: IContext,
  ) {}

  async execute(query: GetBasesQuery): Promise<IGetBasesQueryOutput> {
    const spaceId = this.context.mustGetCurrentSpaceId()
    const spec = new WithBaseSpaceId(spaceId)
    return this.repo.find(Some(spec))
  }
}
