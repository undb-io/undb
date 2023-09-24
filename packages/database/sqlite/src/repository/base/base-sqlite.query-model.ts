import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { BaseSpecification, IBaseQueryModel, IQueryBase } from '@undb/core'
import { Base } from '../../entity/base.js'
import { BaseSqliteMapper } from './base-sqlite.mapper.js'
import { BaseSqliteQueryVisitor } from './base-sqlite.query-visitor.js'

export class BaseSqliteQueryModel implements IBaseQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(spec: BaseSpecification): Promise<IQueryBase[]> {
    const qb = this.em.qb(Base)
    const visitor = new BaseSqliteQueryVisitor(this.em, qb)
    spec.accept(visitor)

    const bases = await qb.getResultList()

    return bases.map((base) => BaseSqliteMapper.toQuery(base))
  }
}
