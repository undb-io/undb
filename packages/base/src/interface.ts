import type { CompositeSpecification, ISpecVisitor } from "@undb/domain"
import type { Base } from "./base.js"
import type { WithBaseId } from "./specifications/base-id.specification.js"
import type { WithBaseName } from "./specifications/base-name.specification.js"
import type { WithBaseOption } from "./specifications/base-option.specification.js"
import type { WithBaseQ } from "./specifications/base-q.specification.js"
import type { WithBaseSpaceId } from "./specifications/base-space-id.specification.js"
import type { DuplicatedBaseSpecification } from "./specifications/base.specification.js"

export interface IBaseSpecVisitor extends ISpecVisitor {
  withId(v: WithBaseId): void
  withOption(v: WithBaseOption): void
  withBaseSpaceId(v: WithBaseSpaceId): void
  duplicatedBase(v: DuplicatedBaseSpecification): void
  withName(v: WithBaseName): void
  withQ(v: WithBaseQ): void
}

export type IBaseSpecification = CompositeSpecification<Base, IBaseSpecVisitor>
