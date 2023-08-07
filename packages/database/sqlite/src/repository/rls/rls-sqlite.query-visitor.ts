import type { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import type {
  IRLSVisitor,
  RLSSubjectContainsUser,
  WithRLSAction,
  WithRLSActionIn,
  WithRLSId,
  WithRLSPolicy,
  WithRLSPolicyFilter,
  WithRLSSubjects,
  WithRLSTableId,
} from '@undb/authz'
import type { ISpecVisitor, ISpecification } from '@undb/domain'
import type { RLS } from '../../entity/rls.js'

export class RLSSqliteQueryVisitor implements IRLSVisitor {
  constructor(
    private readonly em: EntityManager,
    private qb: QueryBuilder<RLS>,
  ) {
    this.qb = this.qb.andWhere({ deletedAt: null })
  }
  withId(s: WithRLSId): void {
    this.qb.andWhere({ id: s.id.value })
  }
  withTableId(s: WithRLSTableId): void {
    this.qb.andWhere({ table: s.tableId.value })
  }
  withRLSPolicy(s: WithRLSPolicy): void {
    throw new Error('Method not implemented.')
  }
  withRLSPolicyAction(s: WithRLSAction): void {
    this.qb.andWhere({ policy: { action: s.action } })
  }
  withRLSPolicyFilter(s: WithRLSPolicyFilter): void {
    throw new Error('Method not implemented.')
  }
  withRLSSubjects(s: WithRLSSubjects): void {
    throw new Error('Method not implemented.')
  }
  actionsIn(s: WithRLSActionIn): void {
    this.qb.andWhere({ policy: { action: s.actions } })
  }
  subjectContainsUser(s: RLSSubjectContainsUser): void {
    throw new Error('Method not implemented.')
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
