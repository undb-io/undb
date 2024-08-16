import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { Base } from "../base"
import type { IBaseSpecVisitor } from "../interface"

export class DuplicatedBaseSpecification extends CompositeSpecification<Base, IBaseSpecVisitor> {
  constructor(
    public readonly originalBase: Base,
    public readonly duplicatedBase: Base,
  ) {
    super()
  }
  isSatisfiedBy(t: Base): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: Base): Result<Base, string> {
    return Ok(t)
  }
  accept(v: IBaseSpecVisitor): Result<void, string> {
    v.duplicatedBase(this)
    return Ok(undefined)
  }
}
