import { CompositeSpecification } from "@undb/domain"
import type { Result } from "oxide.ts"
import { Ok } from "oxide.ts"
import type { ApiTokenDo } from "../api-token.do.js"
import type { IApiTokenVisitor } from "../interface.js"

export class WithApiTokenUserId extends CompositeSpecification<ApiTokenDo, IApiTokenVisitor> {
  constructor(public readonly userId: string) {
    super()
  }
  isSatisfiedBy(t: ApiTokenDo): boolean {
    return t.userId === this.userId
  }
  mutate(t: ApiTokenDo): Result<ApiTokenDo, string> {
    t.userId = this.userId
    return Ok(t)
  }
  accept(v: IApiTokenVisitor): Result<void, string> {
    v.withUserId(this)
    return Ok(undefined)
  }
}
