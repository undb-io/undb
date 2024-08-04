import { Ok, type Result } from "@undb/domain"
import type { SpaceMember } from "../space-member"
import { SpaceMemberComositeSpecification } from "../space-member.composite-specification"
import type { ISpaceMemberVisitor } from "../space-member.visitor"

export class WithSpaceMemberBaseId extends SpaceMemberComositeSpecification {
  constructor(public readonly baseId: string) {
    super()
  }
  isSatisfiedBy(t: SpaceMember): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: SpaceMember): Result<SpaceMember, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: ISpaceMemberVisitor): Result<void, string> {
    v.withBaseId(this)
    return Ok(undefined)
  }
}
