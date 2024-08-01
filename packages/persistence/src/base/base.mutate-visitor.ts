import type { IBaseSpecVisitor, WithBaseId, WithBaseName, WithBaseQ } from "@undb/base"
import { AbstractQBMutationVisitor } from "../abstract-qb.visitor"

export class BaseMutateVisitor extends AbstractQBMutationVisitor implements IBaseSpecVisitor {
  withId(v: WithBaseId): void {
    throw new Error("Method not implemented.")
  }
  withName(v: WithBaseName): void {
    this.setData("name", v.name.value)
  }
  withQ(v: WithBaseQ): void {
    throw new Error("Method not implemented.")
  }
}
