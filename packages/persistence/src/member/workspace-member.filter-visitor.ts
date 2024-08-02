import type { SpaceMember, WithSpaceMemberId, WithSpaceMemberQ } from "@undb/authz"
import type { ISpaceMemberVisitor } from "@undb/authz/src/workspace-member/workspace-member.visitor"
import type { ISpecVisitor, ISpecification } from "@undb/domain"
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"

export class SpaceMemberFilterVisitor extends AbstractQBVisitor<SpaceMember> implements ISpaceMemberVisitor {
  constructor(protected readonly eb: ExpressionBuilder<Database, "undb_space_member" | "undb_user">) {
    super(eb)
  }
  withQ(q: WithSpaceMemberQ): void {
    const cond = this.eb.eb("undb_user.username", "like", `%${q.q}%`)
    this.addCond(cond)
  }
  withId(q: WithSpaceMemberId): void {
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
