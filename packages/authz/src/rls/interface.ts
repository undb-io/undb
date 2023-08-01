import type { CompositeSpecification, ISpecVisitor } from '@undb/domain'
import type { RLS } from './rls.js'
import type { WithRLSDetails } from './specifications/rls-detail.specification.js'
import type { WithRLSTableId } from './specifications/rls-table-id.specification.js'

export interface IRLSVisitor extends ISpecVisitor {
  withTableId(s: WithRLSTableId): void
  withRLSDetails(s: WithRLSDetails): void
}

export type RLSSpecification = CompositeSpecification<RLS, IRLSVisitor>
