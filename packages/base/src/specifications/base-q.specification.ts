import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { Base } from "../base.js"
import type { IBaseSpecVisitor } from "../interface.js"

export class WithBaseQ extends CompositeSpecification<Base, IBaseSpecVisitor> {
  constructor(public readonly q: string) {
    super()
  }
  isSatisfiedBy(t: Base): boolean {
    return t.name.unpack().includes(this.q)
  }
  mutate(t: Base): Result<Base, string> {
    return Ok(t)
  }
  accept(v: IBaseSpecVisitor): Result<void, string> {
    v.withQ(this)
    return Ok(undefined)
  }
}
