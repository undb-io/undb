import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { ISpaceSpecVisitor } from "../interface.js"
import type { Space } from "../space.do.js"

export class WithSpaceShareId extends CompositeSpecification<Space, ISpaceSpecVisitor> {
  constructor(public readonly shareId: string) {
    super()
  }
  isSatisfiedBy(t: Space): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: Space): Result<Space, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: ISpaceSpecVisitor): Result<void, string> {
    v.withShareId(this)
    return Ok(undefined)
  }
}
