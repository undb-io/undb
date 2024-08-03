import type {
  ISpaceMemberVisitor,
  SpaceMember,
  WithSpaceMemberId,
  WithSpaceMemberQ,
  WithSpaceMemberSpaceId,
} from "@undb/authz"
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"

export class SpaceMemberFilterVisitor extends AbstractQBVisitor<SpaceMember> implements ISpaceMemberVisitor {
  constructor(protected readonly eb: ExpressionBuilder<Database, "undb_space_member" | "undb_user">) {
    super(eb)
  }
  withQ(q: WithSpaceMemberQ): void {
    if (!q.q) {
      return
    }
    const cond = this.eb.eb("undb_user.username", "like", `%${q.q}%`)
    this.addCond(cond)
  }
  withId(q: WithSpaceMemberId): void {
    const cond = this.eb.eb("undb_user.id", "=", q.id)
    this.addCond(cond)
  }
  withSpaceId(s: WithSpaceMemberSpaceId): void {
    const cond = this.eb.eb("undb_space_member.space_id", "=", s.spaceId)
    this.addCond(cond)
  }
}
