import type { CompositeSpecification, ISpecVisitor } from '@undb/domain'
import type { RLS } from './rls.js'
import type { WithRLSPolicies } from './specifications/rls-policy.specification.js'
import type { WithRLSTableId } from './specifications/rls-table-id.specification.js'
import { WithRLSViewId } from './specifications/rls-view-id.specification.js'

export interface IRLSVisitor extends ISpecVisitor {
  withTableId(s: WithRLSTableId): void
  withViewId(s: WithRLSViewId): void
  withRLSPolicies(s: WithRLSPolicies): void
}

export type RLSSpecification = CompositeSpecification<RLS, IRLSVisitor>
