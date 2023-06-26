import type { CompositeSpecification } from '@undb/domain'
import { Share } from '../share.js'
import { WithShareView } from './share-target.specification.js'

export interface IShareSpecVisitor {
  targetView(s: WithShareView): void

  or(left: ShareSpecification, right: ShareSpecification): IShareSpecVisitor
  not(): IShareSpecVisitor
}

export type ShareSpecification = CompositeSpecification<Share, IShareSpecVisitor>
