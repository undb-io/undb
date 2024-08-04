import { CompositeSpecification, Ok, Result } from "@undb/domain"
import type { ISpaceSpecVisitor } from "../interface.js"
import type { Space } from "../space.do.js"

export class WithSpaceApiToken extends CompositeSpecification<Space, ISpaceSpecVisitor> {
  constructor(public readonly apiToken: string) {
    super()
  }
  isSatisfiedBy(t: Space): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: Space): Result<Space, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: ISpaceSpecVisitor): Result<void, string> {
    v.withApiToken(this)
    return Ok(undefined)
  }
}
