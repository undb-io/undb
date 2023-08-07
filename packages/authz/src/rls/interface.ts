import type { CompositeSpecification, ISpecVisitor } from '@undb/domain'
import type { RLS } from './rls.js'
import type { WithRLSId } from './specifications/rls-id.specification.js'
import type {
  WithRLSAction,
  WithRLSActionIn,
  WithRLSPolicy,
  WithRLSPolicyFilter,
} from './specifications/rls-policy.specification.js'
import type { RLSSubjectContainsUser, WithRLSSubjects } from './specifications/rls-subject.specification.js'
import type { WithRLSTableId } from './specifications/rls-table-id.specification.js'

export interface IRLSVisitor extends ISpecVisitor {
  withId(s: WithRLSId): void
  withTableId(s: WithRLSTableId): void
  withRLSPolicy(s: WithRLSPolicy): void
  withRLSPolicyAction(s: WithRLSAction): void
  withRLSPolicyFilter(s: WithRLSPolicyFilter): void
  withRLSSubjects(s: WithRLSSubjects): void
  actionsIn(s: WithRLSActionIn): void
  subjectContainsUser(s: RLSSubjectContainsUser): void
}

export type RLSSpecification = CompositeSpecification<RLS, IRLSVisitor>
