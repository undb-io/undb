import type { WithWorkspaceMemberQ, WorkspaceMember } from "@undb/authz"
import type { IWorkspaceMemberVisitor } from "@undb/authz/src/workspace-member/workspace-member.visitor"
import type { ISpecVisitor, ISpecification } from "@undb/domain"
import { like } from "drizzle-orm"
import { AbstractDBFilterVisitor } from "../abstract-db.visitor"
import { users } from "../tables"

export class WorkspaceMemberFilterVisitor
  extends AbstractDBFilterVisitor<WorkspaceMember>
  implements IWorkspaceMemberVisitor
{
  withQ(q: WithWorkspaceMemberQ): void {
    this.addCond(like(users.username, `%${q.q}%`))
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
