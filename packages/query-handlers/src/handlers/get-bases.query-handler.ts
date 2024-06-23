import { injectBaseQueryRepository, type IBaseDTO, type IBaseQueryRepository } from "@undb/base"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { None, type IQueryHandler } from "@undb/domain"
import { GetBasesQuery } from "@undb/queries"

@queryHandler(GetBasesQuery)
@singleton()
export class GetBasesQueryHandler implements IQueryHandler<GetBasesQuery, any> {
  constructor(
    @injectBaseQueryRepository()
    private readonly repo: IBaseQueryRepository,
  ) {}

  async execute(query: GetBasesQuery): Promise<IBaseDTO[]> {
    return this.repo.find(None)
  }
}
