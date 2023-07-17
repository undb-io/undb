import type { CompositeSpecification } from '@undb/domain'
import type { Share } from '../share.js'
import type { WithShareEnabled } from './share-enabled.specification.js'
import type { WithShareId } from './share-id.specification.js'
import type { WithShareForm, WithShareView } from './share-target.specification.js'

export interface IShareSpecVisitor {
  idEqual(s: WithShareId): void
  targetView(s: WithShareView): void
  targetForm(s: WithShareForm): void
  enabled(s: WithShareEnabled): void

  or(left: ShareSpecification, right: ShareSpecification): IShareSpecVisitor
  not(): IShareSpecVisitor
}

export type ShareSpecification = CompositeSpecification<Share, IShareSpecVisitor>
