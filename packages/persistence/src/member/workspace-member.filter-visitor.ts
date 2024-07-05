import type { WithWorkspaceMemberId, WithWorkspaceMemberQ, WorkspaceMember } from "@undb/authz"
import type { IWorkspaceMemberVisitor } from "@undb/authz/src/workspace-member/workspace-member.visitor"
import type { ISpecVisitor, ISpecification } from "@undb/domain"
import { eq, like } from "drizzle-orm"
import { AbstractDBFilterVisitor } from "../abstract-db.visitor"
import { users } from "../tables"

export class WorkspaceMemberFilterVisitor
  extends AbstractDBFilterVisitor<WorkspaceMember>
  implements IWorkspaceMemberVisitor
{
  withQ(q: WithWorkspaceMemberQ): void {
    this.addCond(like(users.username, `%${q.q}%`))
  }
  withId(q: WithWorkspaceMemberId): void {
    this.addCond(eq(users.id, q.id))
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
