import type { Base, IBaseSpecVisitor, WithBaseId, WithBaseName, WithBaseQ } from "@undb/base"
import { eq, like } from "drizzle-orm"
import { AbstractDBFilterVisitor } from "../abstract-db.visitor"
import { baseTable } from "../tables"

export class BaseFilterVisitor extends AbstractDBFilterVisitor<Base> implements IBaseSpecVisitor {
  withId(v: WithBaseId): void {
    this.addCond(eq(baseTable.name, v.id.value))
  }
  withName(v: WithBaseName): void {
    this.addCond(eq(baseTable.name, v.name.value))
  }
  withQ(v: WithBaseQ): void {
    this.addCond(like(baseTable.name, `%${v.q}%`))
  }
}
