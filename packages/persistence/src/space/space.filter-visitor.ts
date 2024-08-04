import type { ISpaceSpecVisitor, Space } from "@undb/space"
import type { WithSpaceBaseId, WithSpaceId, WithSpaceIsPersonal, WithSpaceName } from "@undb/space/src/specifications"
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"

export class SpaceFilterVisitor extends AbstractQBVisitor<Space> implements ISpaceSpecVisitor {
  constructor(protected readonly eb: ExpressionBuilder<Database, "undb_space">) {
    super(eb)
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
