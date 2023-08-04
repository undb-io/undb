import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type { IRLSCache } from '@undb/authz'
import { RLSFactory, type IRLSRepository, type RLS as RLSDO, type RLSSpecification } from '@undb/authz'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { RLS } from '../../entity/rls.js'
import { Table } from '../../entity/table.js'
import { RLSSqliteMapper } from './rls-sqlite.mapper.js'
import { RLSSqliteMutationVisitor } from './rls-sqlite.mutation-visitor.js'
import { RLSSqliteQueryVisitor } from './rls-sqlite.query-visitor.js'

export class RLSSqliteRepository implements IRLSRepository {
  constructor(
    private readonly em: EntityManager,
    protected readonly cache: IRLSCache,
  ) {}

  async findOneById(id: string): Promise<Option<RLSDO>> {
    const cached = await this.cache.get(id)
    if (cached) {
      const rls = RLSFactory.fromQuery(cached)
      return Some(rls)
    }
    const found = await this.em.findOne(RLS, id)
    if (!found) return None

    return Some(RLSSqliteMapper.toDomain(found))
  }

  async find(spec: RLSSpecification): Promise<RLSDO[]> {
    const em = this.em.fork()
    const qb = em.qb(RLS)

    const visitor = new RLSSqliteQueryVisitor(em, qb)
    spec.accept(visitor)

    const result = await qb.getResultList()

    return result.map((r) => RLSSqliteMapper.toDomain(r))
  }

  async insert(rls: RLSDO): Promise<void> {
    const em = this.em.fork()
    const table = em.getReference(Table, rls.tableId.value)
    const entity = new RLS(table, rls)
    await em.insert(RLS, entity)
  }

  async updateOneById(id: string, spec: RLSSpecification): Promise<void> {
    await this.cache.remove(id)

    const em = this.em.fork()
    const visitor = new RLSSqliteMutationVisitor(em, id)
    spec.accept(visitor)

    await visitor.commit()
  }

  async deleteOneById(id: string): Promise<void> {
    await this.cache.remove(id)

    const em = this.em.fork()
    const entity = em.getReference(RLS, id)
    wrap(entity).assign({ deletedAt: new Date() })
    await em.persistAndFlush(entity)
  }
}
