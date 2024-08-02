import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { ISpaceSpecVisitor } from "../interface"
import type { Space } from "../space.do"
import { SpaceName } from "../value-objects/space-name.vo.js"

export class WithSpaceName extends CompositeSpecification<Space, ISpaceSpecVisitor> {
  constructor(public readonly name: SpaceName) {
    super()
  }
  static fromString(name: string) {
    return new WithSpaceName(new SpaceName({ value: name }))
  }
  isSatisfiedBy(t: Space): boolean {
    return this.name.equals(t.name)
  }
  mutate(t: Space): Result<Space, string> {
    t.name = this.name
    return Ok(t)
  }
  accept(v: ISpaceSpecVisitor): Result<void, string> {
    v.withName(this)
    return Ok(undefined)
  }
}
