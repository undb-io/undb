import { injectBaseQueryRepository, type IBaseDTO, type IBaseQueryRepository } from "@undb/base"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetBaseQuery, type IGetBaseQuery } from "@undb/queries"

@queryHandler(GetBaseQuery)
@singleton()
export class GetBaseQueryHandler implements IQueryHandler<any, IBaseDTO> {
  constructor(
    @injectBaseQueryRepository()
    private readonly repo: IBaseQueryRepository,
  ) {}

  async execute(query: IGetBaseQuery): Promise<IBaseDTO> {
    const base = await this.repo.findOneById(query.baseId)
    return base.unwrap()
  }
}
