import type { CompositeSpecification, ISpecVisitor } from "@undb/domain"
import type { Space } from "./space.do.js"
import type { WithSpaceApiToken } from "./specifications/space-api-token.specification.js"
import type { WithSpaceAvatar } from "./specifications/space-avatar.specification.js"
import type { WithSpaceBaseId } from "./specifications/space-base-id.specification.js"
import type { WithSpaceId } from "./specifications/space-id.specification.js"
import type { WithSpaceIsPersonal } from "./specifications/space-is-personal.specification.js"
import type { WithSpaceName } from "./specifications/space-name.specification.js"
import type { WithSpaceShareId } from "./specifications/space-share-id.specification.js"
import type { WithSpaceTableId } from "./specifications/space-table-id.specification.js"
import type { WithSpaceUserId } from "./specifications/space-user-id.specification.js"

export interface ISpaceSpecVisitor extends ISpecVisitor {
  withId(v: WithSpaceId): void
  withUserId(v: WithSpaceUserId): void
  withBaseId(v: WithSpaceBaseId): void
  withTableId(v: WithSpaceTableId): void
  withShareId(v: WithSpaceShareId): void
  withApiToken(v: WithSpaceApiToken): void
  withIsPersonal(v: WithSpaceIsPersonal): void
  withName(v: WithSpaceName): void
  withAvatar(v: WithSpaceAvatar): void
}

export type ISpaceSpecification = CompositeSpecification<Space, ISpaceSpecVisitor>
