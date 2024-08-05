import { CompositeSpecification, Ok, Option, Result } from "@undb/domain"
import type { ISpaceSpecVisitor } from "../interface.js"
import type { Space } from "../space.do.js"
import { SpaceAvatar } from "../value-objects/space-avatar.vo.js"

export class WithSpaceAvatar extends CompositeSpecification<Space, ISpaceSpecVisitor> {
  constructor(public readonly avatar: SpaceAvatar | undefined) {
    super()
  }
  static fromString(avatar: string | undefined) {
    return new WithSpaceAvatar(SpaceAvatar.from(avatar))
  }
  isSatisfiedBy(t: Space): boolean {
    return t.avatar.mapOr(false, (v) => v.value === this.avatar?.value)
  }
  mutate(t: Space): Result<Space, string> {
    t.avatar = Option(this.avatar)
    return Ok(t)
  }
  accept(v: ISpaceSpecVisitor): Result<void, string> {
    v.withAvatar(this)
    return Ok(undefined)
  }
}
