import { CompositeSpecification } from "@undb/domain"
import type { Result } from "oxide.ts"
import { Ok } from "oxide.ts"
import type { ApiTokenId } from "../api-token-id.vo.js"
import type { ApiTokenDo } from "../api-token.do.js"
import type { IApiTokenVisitor } from "../interface.js"

export class WithApiTokenId extends CompositeSpecification<ApiTokenDo, IApiTokenVisitor> {
  constructor(public readonly id: ApiTokenId) {
    super()
  }
  isSatisfiedBy(t: ApiTokenDo): boolean {
    return t.id.equals(this.id)
  }
  mutate(t: ApiTokenDo): Result<ApiTokenDo, string> {
    t.id = this.id
    return Ok(t)
  }
  accept(v: IApiTokenVisitor): Result<void, string> {
    v.withId(this)
    return Ok(undefined)
  }
}
