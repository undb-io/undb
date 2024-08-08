import type { IInvitationVisitor, WithEmail, WithInvitedAt, WithRole, WithSpaceId, WithStatus } from "@undb/authz"
import { AbstractQBMutationVisitor } from "../abstract-qb.visitor"

export class InvitationMutationVisitor extends AbstractQBMutationVisitor implements IInvitationVisitor {
  constructor() {
    super()
  }
  withSpaceId(spec: WithSpaceId): void {
    throw new Error("Method not implemented.")
  }
  withRole(spec: WithRole): void {
    this.setData("role", spec.role)
  }
  withInvitedAt(spec: WithInvitedAt): void {
    this.setData("invited_at", spec.invitedAt.getTime())
  }

  withEmail(spec: WithEmail): void {
    this.setData("email", spec.email)
  }

  withStatus(spec: WithStatus): void {
    this.setData("status", spec.status)
  }
}
