import type { CompositeSpecification, ISpecVisitor } from "@undb/domain"
import type { Share } from "../share.js"
import type { WithShareEnabled } from "./share-enabled.specification.js"
import type { WithShareId } from "./share-id.specification.js"
import type { WithShareSpaceId } from "./share-space-id.specification.js"
import type {
  WithShareBase,
  WithShareDashboard,
  WithShareForm,
  WithShareTable,
  WithShareView,
} from "./share-target.specification.js"

export interface IShareSpecVisitor extends ISpecVisitor {
  idEqual(s: WithShareId): void
  targetView(s: WithShareView): void
  targetForm(s: WithShareForm): void
  targetTable(s: WithShareTable): void
  targetBase(s: WithShareBase): void
  targetDashboard(s: WithShareDashboard): void
  enabled(s: WithShareEnabled): void
  withShareSpaceId(s: WithShareSpaceId): void
}

export type ShareSpecification = CompositeSpecification<Share, IShareSpecVisitor>
