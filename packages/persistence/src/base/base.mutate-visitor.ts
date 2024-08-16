import type { IBaseSpecVisitor, WithBaseId, WithBaseName, WithBaseQ, WithBaseSpaceId } from "@undb/base"
import type { DuplicatedBaseSpecification } from "@undb/base/src/specifications/base.specification"
import { AbstractQBMutationVisitor } from "../abstract-qb.visitor"

export class BaseMutateVisitor extends AbstractQBMutationVisitor implements IBaseSpecVisitor {
  duplicatedBase(v: DuplicatedBaseSpecification): void {
    throw new Error("Method not implemented.")
  }
  withId(v: WithBaseId): void {
    throw new Error("Method not implemented.")
  }
  withBaseSpaceId(v: WithBaseSpaceId): void {
    throw new Error("Method not implemented.")
  }
  withName(v: WithBaseName): void {
    this.setData("name", v.name.value)
  }
  withQ(v: WithBaseQ): void {
    throw new Error("Method not implemented.")
  }
}
