import { injectBaseQueryRepository, type IBaseQueryRepository } from "@undb/base"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetBaseQuery, type IGetBaseOutput, type IGetBaseQuery } from "@undb/queries"

@queryHandler(GetBaseQuery)
@singleton()
export class GetBaseQueryHandler implements IQueryHandler<IGetBaseQuery, IGetBaseOutput> {
  constructor(
    @injectBaseQueryRepository()
    private readonly repo: IBaseQueryRepository,
  ) {}

  async execute(query: IGetBaseQuery): Promise<IGetBaseOutput> {
    const base = await this.repo.findOneById(query.baseId)
    return base.expect("base not found with id: " + query.baseId)
  }
}
