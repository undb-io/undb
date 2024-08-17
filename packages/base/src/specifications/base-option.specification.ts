import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { Base } from "../base.js"
import type { IBaseSpecVisitor } from "../interface.js"
import { BaseOption } from "../value-objects/base-option.js"

export class WithBaseOption extends CompositeSpecification<Base, IBaseSpecVisitor> {
  constructor(public readonly option: BaseOption) {
    super()
  }
  isSatisfiedBy(t: Base): boolean {
    return this.option.equals(t.option)
  }
  mutate(t: Base): Result<Base, string> {
    t.option = this.option
    return Ok(t)
  }
  accept(v: IBaseSpecVisitor): Result<void, string> {
    v.withOption(this)
    return Ok(undefined)
  }
}
