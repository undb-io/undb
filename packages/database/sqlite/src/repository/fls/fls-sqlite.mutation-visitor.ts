import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
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
import { FLS } from '../../entity/fls.js'
import { BaseEntityManager } from '../base-entity-manager.js'

export class FLSSqliteMutationVisitor extends BaseEntityManager implements IFLSVisitor {
  constructor(
    protected readonly em: EntityManager,
    public readonly id: string,
  ) {
    super(em)
  }
  withFLSSubjects(s: WithFLSSubjects): void {
    const fls = this.em.getReference(FLS, this.id)
    wrap(fls).assign({ subjects: s.subjects.subjects.map((s) => s.value) })
    this.em.persist(fls)
  }
  subjectContainsUser(s: FLSSubjectContainsUser): void {
    throw new Error('Method not implemented.')
  }
  withId(s: WithFLSId): void {
    throw new Error('Method not implemented.')
  }
  withTableId(s: WithFLSTableId): void {
    throw new Error('Method not implemented.')
  }
  withFieldId(s: WithFLSFieldId): void {
    throw new Error('Method not implemented.')
  }
  withFLSPolicy(s: WithFLSPolicy): void {
    throw new Error('Method not implemented.')
  }
  withFLSPolicyAction(s: WithFLSAction): void {
    const fls = this.em.getReference(FLS, this.id)
    wrap(fls).assign({ policy: { action: s.action } })
    this.em.persist(fls)
  }
  withFLSPolicyFilter(s: WithFLSPolicyFilter): void {
    const fls = this.em.getReference(FLS, this.id)
    wrap(fls).assign({ policy: { filter: s.filter.value } })
    this.em.persist(fls)
  }
  actionsIn(s: WithFLSActionIn): void {
    throw new Error('Method not implemented.')
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
