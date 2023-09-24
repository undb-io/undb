import type { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import type { IBaseSpecVisitor, WithBaseId, WithBaseName } from '@undb/core'
import type { ISpecVisitor, ISpecification } from '@undb/domain/dist/index.js'
import type { Base } from '../../entity/base.js'

export class BaseSqliteQueryVisitor implements IBaseSpecVisitor {
  constructor(
    private readonly em: EntityManager,
    private qb: QueryBuilder<Base>,
  ) {}

  withId(v: WithBaseId): void {
    this.qb.andWhere({ id: v.id.value })
  }
  withName(v: WithBaseName): void {
    this.qb.andWhere({ name: v.name.unpack() })
  }
  or(left: ISpecification<Base, ISpecVisitor>, right: ISpecification<Base, ISpecVisitor>): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
