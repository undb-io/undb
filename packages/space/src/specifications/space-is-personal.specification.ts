import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { ISpaceSpecVisitor } from "../interface"
import type { Space } from "../space.do"

export class WithSpaceIsPersonal extends CompositeSpecification<Space, ISpaceSpecVisitor> {
  constructor(public readonly isPersonal: boolean) {
    super()
  }
  isSatisfiedBy(t: Space): boolean {
    return this.isPersonal === t.isPersonal
  }
  mutate(t: Space): Result<Space, string> {
    t.isPersonal = this.isPersonal
    return Ok(t)
  }
  accept(v: ISpaceSpecVisitor): Result<void, string> {
    v.withIsPersonal(this)
    return Ok(undefined)
  }
}
