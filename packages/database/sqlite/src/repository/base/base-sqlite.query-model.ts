import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { BaseSpecification, IBaseQueryModel, IQueryBase } from '@undb/core'
import type { Option } from 'oxide.ts'
import { Base } from '../../entity/base.js'
import { BaseSqliteMapper } from './base-sqlite.mapper.js'
import { BaseSqliteQueryVisitor } from './base-sqlite.query-visitor.js'

export class BaseSqliteQueryModel implements IBaseQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(spec: Option<BaseSpecification>): Promise<IQueryBase[]> {
    const qb = this.em.qb(Base)
    const visitor = new BaseSqliteQueryVisitor(this.em, qb)
    if (spec.isSome()) {
      spec.unwrap().accept(visitor)
    }

    const bases = await qb.getResultList()

    return bases.map((base) => BaseSqliteMapper.toQuery(base))
  }
}
