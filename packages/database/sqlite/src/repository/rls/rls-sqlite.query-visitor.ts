import { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import { IRLSVisitor, WithRLSId, WithRLSPolicy, WithRLSTableId, WithRLSViewId } from '@undb/authz'
import { ISpecVisitor, ISpecification } from '@undb/domain/dist'
import { RLS } from '../../entity/rls'

export class RLSSqliteQueryVisitor implements IRLSVisitor {
  constructor(
    private readonly em: EntityManager,
    private qb: QueryBuilder<RLS>,
  ) {}
  withId(s: WithRLSId): void {
    this.qb.andWhere({ id: s.id.value })
  }
  withTableId(s: WithRLSTableId): void {
    this.qb.andWhere({ table: s.tableId.value })
  }
  withViewId(s: WithRLSViewId): void {
    this.qb.andWhere({ view: s.viewId.value })
  }
  withRLSPolicy(s: WithRLSPolicy): void {
    throw new Error('Method not implemented.')
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
