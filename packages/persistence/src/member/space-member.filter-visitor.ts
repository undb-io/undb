import type {
  ISpaceMemberVisitor,
  SpaceMember,
  WithSpaceMemberId,
  WithSpaceMemberQ,
  WithSpaceMemberSpaceId,
} from "@undb/authz"
import type { WithSpaceMemberBaseId } from "@undb/authz/src/space-member/specifications/space-member-base-id.specification"
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"
import type { IQueryBuilder } from "../qb"

export class SpaceMemberFilterVisitor extends AbstractQBVisitor<SpaceMember> implements ISpaceMemberVisitor {
  constructor(
    private readonly qb: IQueryBuilder,
    protected readonly eb: ExpressionBuilder<Database, "undb_space_member" | "undb_user">,
  ) {
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
    const cond = this.eb.eb("undb_space_member.user_id", "=", q.id)
    this.addCond(cond)
  }
  withBaseId(s: WithSpaceMemberBaseId): void {
    const subQuery = this.qb.selectFrom("undb_base").select(["undb_base.space_id"]).where("undb_base.id", "=", s.baseId)
    const cond = this.eb.eb("undb_space_member.space_id", "in", subQuery)
    this.addCond(cond)
  }
  withSpaceId(s: WithSpaceMemberSpaceId): void {
    const cond = this.eb.eb("undb_space_member.space_id", "=", s.spaceId)
    this.addCond(cond)
  }
}
