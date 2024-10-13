import type {
  DuplicatedBaseSpecification,
  IBaseSpecVisitor,
  WithBaseId,
  WithBaseName,
  WithBaseOption,
  WithBaseQ,
  WithBaseSpaceId,
} from "@undb/base"
import { AbstractQBMutationVisitor } from "../abstract-qb.visitor"

export class BaseMutateVisitor extends AbstractQBMutationVisitor implements IBaseSpecVisitor {
  withOption(v: WithBaseOption): void {}
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
