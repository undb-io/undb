import { CompositeSpecification, Ok, Result, type ISpecVisitor } from "@undb/domain"
import type { IInvitationStatus, InvitationDo } from "./invitation.do"
import type { ISpaceMemberWithoutOwner } from "./space-member"

export interface IInvitationVisitor extends ISpecVisitor {
  withStatus(spec: WithStatus): void
  withEmail(spec: WithEmail): void
  withRole(spec: WithRole): void
  withInvitedAt(spec: WithInvitedAt): void
  withSpaceId(spec: WithSpaceId): void
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

export class WithEmail extends InvitationCompositeSpecification {
  constructor(public readonly email: string) {
    super()
  }
  isSatisfiedBy(t: InvitationDo): boolean {
    return t.email === this.email
  }
  mutate(t: InvitationDo): Result<InvitationDo, string> {
    t.email = this.email
    return Ok(t)
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    v.withEmail(this)
    return Ok(undefined)
  }
}

export class WithRole extends InvitationCompositeSpecification {
  constructor(public readonly role: ISpaceMemberWithoutOwner) {
    super()
  }
  isSatisfiedBy(t: InvitationDo): boolean {
    return t.role === this.role
  }
  mutate(t: InvitationDo): Result<InvitationDo, string> {
    t.role = this.role
    return Ok(t)
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    v.withRole(this)
    return Ok(undefined)
  }
}

export class WithInvitedAt extends InvitationCompositeSpecification {
  constructor(public readonly invitedAt: Date) {
    super()
  }
  isSatisfiedBy(t: InvitationDo): boolean {
    return t.invitedAt.getTime() === this.invitedAt.getTime()
  }
  mutate(t: InvitationDo): Result<InvitationDo, string> {
    t.invitedAt = this.invitedAt
    return Ok(t)
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    v.withInvitedAt(this)
    return Ok(undefined)
  }
}

export class WithSpaceId extends InvitationCompositeSpecification {
  constructor(public readonly spaceId: string) {
    super()
  }
  isSatisfiedBy(t: InvitationDo): boolean {
    return t.spaceId === this.spaceId
  }
  mutate(t: InvitationDo): Result<InvitationDo, string> {
    t.spaceId = this.spaceId
    return Ok(t)
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    v.withSpaceId(this)
    return Ok(undefined)
  }
}
