import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { ISpaceId } from "@undb/space"
import type { Share } from "../share"
import type { IShareSpecVisitor } from "./interface"

export class WithShareSpaceId extends CompositeSpecification<Share, IShareSpecVisitor> {
  constructor(public readonly spaceId: ISpaceId) {
    super()
  }

  isSatisfiedBy(t: Share): boolean {
    return t.spaceId === this.spaceId
  }
  mutate(t: Share): Result<Share, string> {
    t.spaceId = this.spaceId
    return Ok(t)
  }
  accept(v: IShareSpecVisitor): Result<void, string> {
    v.withShareSpaceId(this)
    return Ok(undefined)
  }
}
