import type { ApiTokenDo, IApiTokenVisitor, WithApiTokenId, WithApiTokenToken, WithApiTokenUserId } from "@undb/openapi"
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"

export class ApiTokenFilterVisitor extends AbstractQBVisitor<ApiTokenDo> implements IApiTokenVisitor {
  constructor(protected readonly eb: ExpressionBuilder<Database, "undb_api_token">) {
    super(eb)
  }
  withId(s: WithApiTokenId): void {
    const cond = this.eb.eb("undb_api_token.id", "=", s.id.value)
    this.addCond(cond)
  }
  withToken(s: WithApiTokenToken): void {
    throw new Error("Method not implemented.")
  }
  withUserId(s: WithApiTokenUserId): void {
    const cond = this.eb.eb("undb_api_token.user_id", "=", s.userId)
    this.addCond(cond)
  }
}
