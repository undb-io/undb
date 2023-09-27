import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type { IBaseSpecVisitor, WithBaseId, WithBaseName, WithBaseQ } from '@undb/core'
import type { ISpecVisitor, ISpecification } from '@undb/domain'
import { Base } from '../../entity/base.js'

export class BaseSqliteMutationVisitor implements IBaseSpecVisitor {
  constructor(
    private readonly baseId: string,
    private readonly em: EntityManager,
  ) {}
  withId(v: WithBaseId): void {
    throw new Error('Method not implemented.')
  }
  withName(v: WithBaseName): void {
    const base = this.em.getReference(Base, this.baseId)
    wrap(base).assign({ name: v.name.unpack() })
    this.em.persist(base)
  }
  withQ(v: WithBaseQ): void {
    throw new Error('Method not implemented.')
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
  idEqual(s: WithBaseId): void {
    throw new Error('not implemented')
  }
}
