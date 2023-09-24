import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { BaseRepository, BaseSpecification, Base as CoreBase } from '@undb/core'
import { Base } from '../../entity/base.js'
import { BaseSqliteMapper } from './base-sqlite.mapper.js'
import { BaseSqliteQueryVisitor } from './base-sqlite.query-visitor.js'

export class BaseSqliteRepository implements BaseRepository {
  constructor(private readonly em: EntityManager) {}

  async find(spec: BaseSpecification): Promise<CoreBase[]> {
    const qb = this.em.qb(Base)
    const visitor = new BaseSqliteQueryVisitor(this.em, qb)

    spec.accept(visitor)

    const bases = await qb.getResultList()

    return bases.map((base) => BaseSqliteMapper.toDomain(base))
  }

  async insert(base: CoreBase): Promise<void> {
    const baseEntity = new Base(base)

    await this.em.insert(baseEntity)
  }
}
