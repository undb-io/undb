import type { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import type { IRLSVisitor, WithRLSAction, WithRLSActionIn, WithRLSId, WithRLSPolicy, WithRLSTableId } from '@undb/authz'
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
  actionsIn(s: WithRLSActionIn): void {
    this.qb.andWhere({ policy: { action: s.actions } })
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
