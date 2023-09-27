import type { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import type { IBaseSpecVisitor, WithBaseId, WithBaseName, WithBaseQ } from '@undb/core'
import type { ISpecVisitor, ISpecification } from '@undb/domain'
import type { Base } from '../../entity/base.js'

export class BaseSqliteQueryVisitor implements IBaseSpecVisitor {
  constructor(
    private readonly em: EntityManager,
    private qb: QueryBuilder<Base>,
  ) {
    this.qb = this.qb.andWhere({ deletedAt: null })
  }

  withId(v: WithBaseId): void {
    this.qb.andWhere({ id: v.id.value })
  }
  withName(v: WithBaseName): void {
    this.qb.andWhere({ name: v.name.unpack() })
  }
  withQ(v: WithBaseQ): void {
    this.qb.andWhere({ name: { $like: `%${v.q}%` } })
  }
  or(left: ISpecification<Base, ISpecVisitor>, right: ISpecification<Base, ISpecVisitor>): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
