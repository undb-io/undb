import { CompositeSpecification } from "@undb/domain"
import type { Result } from "oxide.ts"
import { Ok } from "oxide.ts"
import { ApiTokenToken } from "../api-token-token.vo.js"
import type { ApiTokenDo } from "../api-token.do.js"
import type { IApiTokenVisitor } from "../interface.js"

export class WithApiTokenToken extends CompositeSpecification<ApiTokenDo, IApiTokenVisitor> {
  constructor(public readonly token: ApiTokenToken) {
    super()
  }
  static fromString(token: string): WithApiTokenToken {
    return new this(ApiTokenToken.fromString(token))
  }
  static create(): WithApiTokenToken {
    return new this(ApiTokenToken.create())
  }
  isSatisfiedBy(t: ApiTokenDo): boolean {
    return t.token.equals(this.token)
  }
  mutate(t: ApiTokenDo): Result<ApiTokenDo, string> {
    t.token = this.token
    return Ok(t)
  }
  accept(v: IApiTokenVisitor): Result<void, string> {
    v.withToken(this)
    return Ok(undefined)
  }
}
