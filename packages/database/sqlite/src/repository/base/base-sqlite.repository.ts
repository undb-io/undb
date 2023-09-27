import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type { BaseRepository, BaseSpecification, Base as CoreBase } from '@undb/core'
import { None, Some, type Option } from 'oxide.ts'
import { Base } from '../../entity/base.js'
import { BaseSqliteMapper } from './base-sqlite.mapper.js'
import { BaseSqliteMutationVisitor } from './base-sqlite.mutation-visitor.js'
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

  async findOneById(id: string): Promise<Option<CoreBase>> {
    const base = await this.em.findOne(Base, { id })
    if (!base) return None

    return Some(BaseSqliteMapper.toDomain(base))
  }

  async insert(base: CoreBase): Promise<void> {
    const baseEntity = new Base(base)

    await this.em.insert(baseEntity)
  }

  async updateOneById(id: string, spec: BaseSpecification): Promise<void> {
    const visitor = new BaseSqliteMutationVisitor(id, this.em)
    spec.accept(visitor)

    await this.em.flush()
  }

  async deleteOneById(id: string): Promise<void> {
    const base = this.em.getReference(Base, id)
    wrap(base).assign({ deletedAt: new Date() })
    await this.em.persistAndFlush(base)
  }
}
