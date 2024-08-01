import { Ok, type Result } from "@undb/domain"
import type { WorkspaceMember } from "../workspace-member"
import { WorkspaceMemberComositeSpecification } from "../workspace-member.composite-specification"
import type { IWorkspaceMemberVisitor } from "../workspace-member.visitor"

export class WithWorkspaceMemberQ extends WorkspaceMemberComositeSpecification {
  constructor(public readonly q: string) {
    super()
  }
  isSatisfiedBy(t: WorkspaceMember): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: WorkspaceMember): Result<WorkspaceMember, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IWorkspaceMemberVisitor): Result<void, string> {
    v.withQ(this)
    return Ok(undefined)
  }
}
