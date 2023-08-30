import type { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import type {
  FLSSubjectContainsUser,
  IFLSVisitor,
  WithFLSAction,
  WithFLSActionIn,
  WithFLSFieldId,
  WithFLSId,
  WithFLSPolicy,
  WithFLSPolicyFilter,
  WithFLSSubjects,
  WithFLSTableId,
} from '@undb/authz'
import type { ISpecVisitor, ISpecification } from '@undb/domain'
import type { FLS } from '../../entity/fls.js'

export class FLSSqliteQueryVisitor implements IFLSVisitor {
  constructor(
    private readonly em: EntityManager,
    private qb: QueryBuilder<FLS>,
  ) {
    this.qb = this.qb.andWhere({ deletedAt: null })
  }
  withFLSSubjects(s: WithFLSSubjects): void {
    throw new Error('Method not implemented.')
  }
  subjectContainsUser(s: FLSSubjectContainsUser): void {
    throw new Error('Method not implemented.')
  }
  withId(s: WithFLSId): void {
    this.qb.andWhere({ id: s.id.value })
  }
  withTableId(s: WithFLSTableId): void {
    this.qb.andWhere({ table: s.tableId.value })
  }
  withFieldId(s: WithFLSFieldId): void {
    this.qb.andWhere({ field: s.fieldId.value })
  }
  withFLSPolicy(s: WithFLSPolicy): void {
    throw new Error('Method not implemented.')
  }
  withFLSPolicyAction(s: WithFLSAction): void {
    this.qb.andWhere({ policy: { action: s.action } })
  }
  withFLSPolicyFilter(s: WithFLSPolicyFilter): void {
    throw new Error('Method not implemented.')
  }
  actionsIn(s: WithFLSActionIn): void {
    this.qb.andWhere({ policy: { action: s.actions } })
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
