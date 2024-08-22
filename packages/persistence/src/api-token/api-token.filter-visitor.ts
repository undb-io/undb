import type {
  ApiTokenDo,
  IApiTokenVisitor,
  WithApiTokenId,
  WithApiTokenSpaceId,
  WithApiTokenToken,
  WithApiTokenUserId,
} from "@undb/openapi"
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"

export class ApiTokenFilterVisitor extends AbstractQBVisitor<ApiTokenDo> implements IApiTokenVisitor {
  constructor(protected readonly eb: ExpressionBuilder<Database, "undb_api_token">) {
    super(eb)
  }
  withSpaceId(s: WithApiTokenSpaceId): void {
    const cond = this.eb.eb("undb_api_token.space_id", "=", s.spaceId)
    this.addCond(cond)
  }
  withId(s: WithApiTokenId): void {
    const cond = this.eb.eb("undb_api_token.id", "=", s.id.value)
    this.addCond(cond)
  }
  withToken(s: WithApiTokenToken): void {
    const cond = this.eb.eb("undb_api_token.token", "=", s.token.value)
    this.addCond(cond)
  }
  withUserId(s: WithApiTokenUserId): void {
    const cond = this.eb.eb("undb_api_token.user_id", "=", s.userId)
    this.addCond(cond)
  }
  clone(): this {
    return new ApiTokenFilterVisitor(this.eb) as this
  }
}
