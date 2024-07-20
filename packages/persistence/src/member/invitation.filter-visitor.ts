import type { IInvitationVisitor, InvitationDo, WithStatus } from "@undb/authz"
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"

export class InvitationFilterVisitor extends AbstractQBVisitor<InvitationDo> implements IInvitationVisitor {
  constructor(protected readonly eb: ExpressionBuilder<Database, "undb_invitation">) {
    super(eb)
  }

  withStatus(spec: WithStatus): void {
    const cond = this.eb.eb("status", "=", spec.status)
    this.addCond(cond)
  }
}
