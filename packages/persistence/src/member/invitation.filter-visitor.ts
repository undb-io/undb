import type {
  IInvitationVisitor,
  InvitationDo,
  WithEmail,
  WithInvitedAt,
  WithRole,
  WithSpaceId,
  WithStatus,
} from "@undb/authz"
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"

export class InvitationFilterVisitor extends AbstractQBVisitor<InvitationDo> implements IInvitationVisitor {
  constructor(
    protected readonly eb: ExpressionBuilder<Database, "undb_invitation">,
    private readonly spaceId: string,
    cloned = false,
  ) {
    super(eb)
    if (!cloned) {
      this.addCond(this.eb.eb("space_id", "=", spaceId))
    }
  }
  withSpaceId(spec: WithSpaceId): void {
    const cond = this.eb.eb("space_id", "=", spec.spaceId)
    this.addCond(cond)
  }
  withRole(spec: WithRole): void {
    const cond = this.eb.eb("role", "=", spec.role)
    this.addCond(cond)
  }
  withInvitedAt(spec: WithInvitedAt): void {
    const cond = this.eb.eb("invited_at", "=", spec.invitedAt)
    this.addCond(cond)
  }

  withEmail(spec: WithEmail): void {
    const cond = this.eb.eb("email", "=", spec.email)
    this.addCond(cond)
  }

  withStatus(spec: WithStatus): void {
    const cond = this.eb.eb("status", "=", spec.status)
    this.addCond(cond)
  }

  clone(): this {
    return new InvitationFilterVisitor(this.eb, this.spaceId, true) as this
  }
}
