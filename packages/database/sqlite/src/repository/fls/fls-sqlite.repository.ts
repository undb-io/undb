import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type { IFLSCache } from '@undb/authz'
import { FLSFactory, type FLS as FLSDO, type FLSSpecification, type IFLSRepository } from '@undb/authz'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { Field } from '../../entity/field.js'
import { FLS } from '../../entity/fls.js'
import { Table } from '../../entity/table.js'
import { FLSSqliteMapper } from './fls-sqlite.mapper.js'
import { FLSSqliteMutationVisitor } from './fls-sqlite.mutation-visitor.js'
import { FLSSqliteQueryVisitor } from './fls-sqlite.query-visitor.js'

export class FLSSqliteRepository implements IFLSRepository {
  constructor(
    private readonly em: EntityManager,
    protected readonly cache: IFLSCache,
  ) {}

  async findOneById(id: string): Promise<Option<FLSDO>> {
    const cached = await this.cache.get(id)
    if (cached) {
      const fls = FLSFactory.fromQuery(cached)
      return Some(fls)
    }
    const found = await this.em.findOne(FLS, id)
    if (!found) return None

    return Some(FLSSqliteMapper.toDomain(found))
  }

  async find(spec: FLSSpecification): Promise<FLSDO[]> {
    const em = this.em.fork()
    const qb = em.qb(FLS)

    const visitor = new FLSSqliteQueryVisitor(em, qb)
    spec.accept(visitor)

    const result = await qb.getResultList()

    return result.map((r) => FLSSqliteMapper.toDomain(r))
  }

  async insert(fls: FLSDO): Promise<void> {
    const em = this.em.fork()
    const table = em.getReference(Table, fls.tableId.value)
    const field = em.getReference(Field, fls.fieldId.value)
    const entity = new FLS(table, field, fls)
    await em.insert(FLS, entity)
  }

  async updateOneById(id: string, spec: FLSSpecification): Promise<void> {
    await this.cache.remove(id)

    const em = this.em.fork()
    const visitor = new FLSSqliteMutationVisitor(em, id)
    spec.accept(visitor)

    await visitor.commit()
  }

  async deleteOneById(id: string): Promise<void> {
    await this.cache.remove(id)

    const em = this.em.fork()
    const entity = em.getReference(FLS, id)
    wrap(entity).assign({ deletedAt: new Date() })
    await em.persistAndFlush(entity)
  }
}
