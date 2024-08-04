import { Ok, type Result } from "@undb/domain"
import type { SpaceMember } from "../space-member"
import { SpaceMemberComositeSpecification } from "../space-member.composite-specification"
import type { ISpaceMemberVisitor } from "../space-member.visitor"

export class WithSpaceMemberUserId extends SpaceMemberComositeSpecification {
  constructor(public readonly userId: string) {
    super()
  }
  isSatisfiedBy(t: SpaceMember): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: SpaceMember): Result<SpaceMember, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: ISpaceMemberVisitor): Result<void, string> {
    v.withUserId(this)
    return Ok(undefined)
  }
}
