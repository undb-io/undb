import type { CompositeSpecification, ISpecVisitor } from "@undb/domain"
import type { Base } from "./base.js"
import type { WithBaseId } from "./specifications/base-id.specification.js"
import type { WithBaseName } from "./specifications/base-name.specification.js"
import type { WithBaseQ } from "./specifications/base-q.specification.js"
import type { WithBaseSpaceId } from "./specifications/base-space-id.specification.js"

export interface IBaseSpecVisitor extends ISpecVisitor {
  withId(v: WithBaseId): void
  withBaseSpaceId(v: WithBaseSpaceId): void
  withName(v: WithBaseName): void
  withQ(v: WithBaseQ): void
}

export type IBaseSpecification = CompositeSpecification<Base, IBaseSpecVisitor>
