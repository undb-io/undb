import type { Base, IBaseSpecVisitor, WithBaseId, WithBaseName, WithBaseQ } from "@undb/base"
import { AbstractDBMutationVisitor } from "../abstract-db.visitor"
import { baseTable } from "../tables"

export class BaseMutateVisitor extends AbstractDBMutationVisitor<Base, typeof baseTable> implements IBaseSpecVisitor {
  withId(v: WithBaseId): void {
    throw new Error("Method not implemented.")
  }
  withName(v: WithBaseName): void {
    this.addUpdates({ name: v.name.value })
  }
  withQ(v: WithBaseQ): void {
    throw new Error("Method not implemented.")
  }
}
