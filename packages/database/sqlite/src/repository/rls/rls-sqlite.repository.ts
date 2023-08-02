import { EntityManager } from '@mikro-orm/better-sqlite'
import { type IRLSRepository, type RLS as RLSDO, type RLSSpecification } from '@undb/authz'
import { RLS } from '../../entity/rls.js'
import { Table } from '../../entity/table.js'
import { View } from '../../entity/view.js'
import { RLSSqliteMapper } from './rls-sqlite.mapper.js'
import { RLSSqliteQueryVisitor } from './rls-sqlite.query-visitor.js'

export class RLSSqliteRepository implements IRLSRepository {
  constructor(private readonly em: EntityManager) {}

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
    const view = rls.viewId.isSome() ? em.getReference(View, rls.viewId.unwrap().value) : undefined
    const entity = new RLS(table, view, rls)
    console.log(entity)
    console.log(entity)
    console.log(entity)
    console.log(entity)
    console.log(entity)
    console.log(entity)
    console.log(entity)
    console.log(entity)
    console.log(entity)
    console.log(entity)
    console.log(entity)
    await em.insert(RLS, entity)
  }
}
