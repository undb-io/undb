import { CompositeSpecification } from "@undb/domain"
import type { ISpaceId } from "@undb/space"
import type { Result } from "oxide.ts"
import { Ok } from "oxide.ts"
import type { ApiTokenDo } from "../api-token.do.js"
import type { IApiTokenVisitor } from "../interface.js"

export class WithApiTokenSpaceId extends CompositeSpecification<ApiTokenDo, IApiTokenVisitor> {
  constructor(public readonly spaceId: ISpaceId) {
    super()
  }
  isSatisfiedBy(t: ApiTokenDo): boolean {
    return t.spaceId === this.spaceId
  }
  mutate(t: ApiTokenDo): Result<ApiTokenDo, string> {
    t.spaceId = this.spaceId
    return Ok(t)
  }
  accept(v: IApiTokenVisitor): Result<void, string> {
    v.withSpaceId(this)
    return Ok(undefined)
  }
}
