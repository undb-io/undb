import { singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import { type ApiTokenSpecification, type IApiTokenDTO, type IApiTokenQueryRepository } from "@undb/openapi"
import { injectQueryBuilder } from "../qb.provider"
import type { IQueryBuilder } from "../qb.type"
import { ApiTokenFilterVisitor } from "./api-token.filter-visitor"

@singleton()
export class ApiTokenQueryRepository implements IApiTokenQueryRepository {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  async find(spec: ApiTokenSpecification): Promise<IApiTokenDTO[]> {
    const tokens = await this.qb
      .selectFrom("undb_api_token")
      .selectAll()
      .where((eb) => {
        const visitor = new ApiTokenFilterVisitor(eb)
        spec.accept(visitor)
        return visitor.cond
      })
      .execute()

    return tokens.map((token) => ({
      id: token.id,
      userId: token.user_id,
      name: token.name,
      token: token.token,
    }))
  }

  async findOne(spec: ApiTokenSpecification): Promise<Option<IApiTokenDTO>> {
    const token = await this.qb
      .selectFrom("undb_api_token")
      .selectAll()
      .where((eb) => {
        const visitor = new ApiTokenFilterVisitor(eb)
        spec.accept(visitor)
        return visitor.cond
      })
      .executeTakeFirst()

    return token
      ? Some({
          id: token.id,
          userId: token.user_id,
          name: token.name,
          token: token.token,
        })
      : None
  }
  async findOneById(id: string): Promise<Option<IApiTokenDTO>> {
    const token = await this.qb
      .selectFrom("undb_api_token")
      .selectAll()
      .where("undb_api_token.id", "=", id)
      .executeTakeFirst()

    if (!token) {
      return None
    }

    return Some({
      id: token.id,
      name: token.name,
      userId: token.user_id,
      token: token.token,
    })
  }
}
