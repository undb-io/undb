import type { ISpaceSpecVisitor, Space } from "@undb/space"
import type { WithSpaceBaseId, WithSpaceId, WithSpaceIsPersonal, WithSpaceName } from "@undb/space/src/specifications"
import type { WithSpaceUserId } from "@undb/space/src/specifications/space-user-id.specification"
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"
import type { IQueryBuilder } from "../qb"

export class SpaceFilterVisitor extends AbstractQBVisitor<Space> implements ISpaceSpecVisitor {
  constructor(
    private readonly qb: IQueryBuilder,
    protected readonly eb: ExpressionBuilder<Database, "undb_space">,
  ) {
    super(eb)
  }
  withUserId(v: WithSpaceUserId): void {
    const subQuery = this.qb
      .selectFrom("undb_space_member")
      .select(["undb_space_member.space_id"])
      .where("undb_space_member.user_id", "=", v.userId)

    const cond = this.eb.eb("undb_space.id", "in", subQuery)
    this.addCond(cond)
  }
  withId(v: WithSpaceId): void {
    const cond = this.eb.eb("undb_space.id", "=", v.id.value)
    this.addCond(cond)
  }
  withBaseId(v: WithSpaceBaseId): void {
    throw new Error("Method not implemented.")
  }
  withIsPersonal(v: WithSpaceIsPersonal): void {
    throw new Error("Method not implemented.")
  }
  withName(v: WithSpaceName): void {
    throw new Error("Method not implemented.")
  }
}
