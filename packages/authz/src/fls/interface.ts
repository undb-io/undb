import type { CompositeSpecification, ISpecVisitor } from '@undb/domain'
import type { FLS } from './fls.js'
import type { WithFLSFieldId } from './specifications/fls-field-id.specification.js'
import type { WithFLSId } from './specifications/fls-id.specification.js'
import type {
  WithFLSAction,
  WithFLSActionIn,
  WithFLSPolicy,
  WithFLSPolicyFilter,
} from './specifications/fls-policy.specification.js'
import type { FLSSubjectContainsUser, WithFLSSubjects } from './specifications/fls-subject.specification.js'
import type { WithFLSTableId } from './specifications/fls-table-id.specification.js'

export interface IFLSVisitor extends ISpecVisitor {
  withId(s: WithFLSId): void
  withFLSPolicy(s: WithFLSPolicy): void
  withFLSPolicyAction(s: WithFLSAction): void
  actionsIn(s: WithFLSActionIn): void
  withFLSPolicyFilter(s: WithFLSPolicyFilter): void
  withTableId(s: WithFLSTableId): void
  withFieldId(s: WithFLSFieldId): void
  withFLSSubjects(s: WithFLSSubjects): void
  subjectContainsUser(s: FLSSubjectContainsUser): void
}

export type FLSSpecification = CompositeSpecification<FLS, IFLSVisitor>
