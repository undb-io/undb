import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { ISpaceSpecVisitor } from "../interface"
import type { Space } from "../space.do"
import { SpaceId } from "../value-objects/space-id.vo.js"

export class WithSpaceId extends CompositeSpecification<Space, ISpaceSpecVisitor> {
  constructor(public readonly id: SpaceId) {
    super()
  }
  static fromString(id: string) {
    return new WithSpaceId(SpaceId.from(id))
  }
  isSatisfiedBy(t: Space): boolean {
    return this.id.equals(t.id)
  }
  mutate(t: Space): Result<Space, string> {
    t.id = this.id
    return Ok(t)
  }
  accept(v: ISpaceSpecVisitor): Result<void, string> {
    v.withId(this)
    return Ok(undefined)
  }
}
