import type { WithWorkspaceMemberId, WithWorkspaceMemberQ, WorkspaceMember } from "@undb/authz"
import type { IWorkspaceMemberVisitor } from "@undb/authz/src/workspace-member/workspace-member.visitor"
import type { ISpecVisitor, ISpecification } from "@undb/domain"
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"

export class WorkspaceMemberFilterVisitor
  extends AbstractQBVisitor<WorkspaceMember>
  implements IWorkspaceMemberVisitor
{
  constructor(protected readonly eb: ExpressionBuilder<Database, "undb_workspace_member" | "undb_user">) {
    super(eb)
  }
  withQ(q: WithWorkspaceMemberQ): void {
    const cond = this.eb.eb("undb_user.username", "like", `%${q.q}%`)
    this.addCond(cond)
  }
  withId(q: WithWorkspaceMemberId): void {
    const cond = this.eb.eb("undb_user.id", "=", q.id)
    this.addCond(cond)
  }
  and(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new Error("Method not implemented.")
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new Error("Method not implemented.")
  }
  not(spec: ISpecification<any, ISpecVisitor>): this {
    throw new Error("Method not implemented.")
  }
  clone(): this {
    throw new Error("Method not implemented.")
  }
}
