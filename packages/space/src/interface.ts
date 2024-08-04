import type { CompositeSpecification, ISpecVisitor } from "@undb/domain"
import type { Space } from "./space.do.js"
import type { WithSpaceBaseId } from "./specifications/space-base-id.specification.js"
import type { WithSpaceId } from "./specifications/space-id.specification.js"
import type { WithSpaceIsPersonal } from "./specifications/space-is-personal.specification.js"
import type { WithSpaceName } from "./specifications/space-name.specification.js"

export interface ISpaceSpecVisitor extends ISpecVisitor {
  withId(v: WithSpaceId): void
  withBaseId(v: WithSpaceBaseId): void
  withIsPersonal(v: WithSpaceIsPersonal): void
  withName(v: WithSpaceName): void
}

export type ISpaceSpecification = CompositeSpecification<Space, ISpaceSpecVisitor>
