import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { ISpaceId } from "@undb/space"
import type { Base } from "../base.js"
import type { IBaseSpecVisitor } from "../interface.js"

export class WithBaseSpaceId extends CompositeSpecification<Base, IBaseSpecVisitor> {
  constructor(public readonly spaceId: ISpaceId) {
    super()
  }
  isSatisfiedBy(t: Base): boolean {
    return this.spaceId === t.spaceId
  }
  mutate(t: Base): Result<Base, string> {
    t.spaceId = this.spaceId
    return Ok(t)
  }
  accept(v: IBaseSpecVisitor): Result<void, string> {
    v.withBaseSpaceId(this)
    return Ok(undefined)
  }
}
