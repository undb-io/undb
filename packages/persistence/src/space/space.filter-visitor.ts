import type {
  ISpaceSpecVisitor,
  Space,
  WithSpaceApiToken,
  WithSpaceAvatar,
  WithSpaceBaseId,
  WithSpaceId,
  WithSpaceIsPersonal,
  WithSpaceName,
  WithSpaceShareId,
  WithSpaceTableId,
  WithSpaceUserId,
} from "@undb/space"
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"
import type { IQueryBuilder } from "../qb.type"

export class SpaceFilterVisitor extends AbstractQBVisitor<Space> implements ISpaceSpecVisitor {
  constructor(
    private readonly qb: IQueryBuilder,
    protected readonly eb: ExpressionBuilder<Database, "undb_space">,
  ) {
    super(eb)
    this.addCond(this.eb.eb("undb_space.deleted_at", "is", null))
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
  withTableId(v: WithSpaceTableId): void {
    const subQuery = this.qb
      .selectFrom("undb_table")
      .select(["undb_table.space_id"])
      .where("undb_table.id", "=", v.tableId)

    const cond = this.eb.eb("undb_space.id", "in", subQuery)
    this.addCond(cond)
  }
  withApiToken(v: WithSpaceApiToken): void {
    const subQuery = this.qb
      .selectFrom("undb_api_token")
      .select(["space_id"])
      .where("undb_api_token.token", "=", v.apiToken)

    const cond = this.eb.eb("undb_space.id", "in", subQuery)
    this.addCond(cond)
  }
  withAvatar(v: WithSpaceAvatar): void {
    throw new Error("Method not implemented.")
  }
  withShareId(v: WithSpaceShareId): void {
    const subQuery = this.qb.selectFrom("undb_share").select(["space_id"]).where("undb_share.id", "=", v.shareId)

    const cond = this.eb.eb("undb_space.id", "in", subQuery)
    this.addCond(cond)
  }
  withBaseId(v: WithSpaceBaseId): void {
    const subQuery = this.qb.selectFrom("undb_base").select(["undb_base.space_id"]).where("undb_base.id", "=", v.baseId)

    const cond = this.eb.eb("undb_space.id", "in", subQuery)
    this.addCond(cond)
  }
  withIsPersonal(v: WithSpaceIsPersonal): void {
    throw new Error("Method not implemented.")
  }
  withName(v: WithSpaceName): void {
    throw new Error("Method not implemented.")
  }
  clone(): this {
    return new SpaceFilterVisitor(this.qb, this.eb) as this
  }
}
