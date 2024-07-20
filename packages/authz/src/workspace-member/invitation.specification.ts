import { CompositeSpecification, Ok, Result, type ISpecVisitor } from "@undb/domain"
import type { IInvitationStatus, InvitationDo } from "./invitation.do"

export interface IInvitationVisitor extends ISpecVisitor {
  withStatus(spec: WithStatus): void
}

export abstract class InvitationCompositeSpecification extends CompositeSpecification<
  InvitationDo,
  IInvitationVisitor
> {}

export class WithStatus extends InvitationCompositeSpecification {
  constructor(public readonly status: IInvitationStatus) {
    super()
  }
  isSatisfiedBy(t: InvitationDo): boolean {
    return t.status === this.status
  }
  mutate(t: InvitationDo): Result<InvitationDo, string> {
    t.status = this.status
    return Ok(t)
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    v.withStatus(this)
    return Ok(undefined)
  }
}
