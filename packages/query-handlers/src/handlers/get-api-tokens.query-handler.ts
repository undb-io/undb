import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type IQueryHandler } from "@undb/domain"
import {
  injectApiTokenQueryRepository,
  WithApiTokenUserId,
  type IApiTokenDTO,
  type IApiTokenQueryRepository,
} from "@undb/openapi"
import { GetApiTokensQuery, type IGetApiTokensQuery } from "@undb/queries"

@queryHandler(GetApiTokensQuery)
@singleton()
export class GetApiTokensQueryHandler implements IQueryHandler<GetApiTokensQuery, IApiTokenDTO[]> {
  constructor(
    @injectApiTokenQueryRepository()
    private readonly repo: IApiTokenQueryRepository,
  ) {}

  async execute(query: IGetApiTokensQuery): Promise<IApiTokenDTO[]> {
    const spec = new WithApiTokenUserId(query.userId)
    const tokens = await this.repo.find(spec)
    return tokens
  }
}
