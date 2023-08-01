import { EntityManager } from '@mikro-orm/better-sqlite'
import { IRLSRepository, RLS as RLSDO, RLSSpecification } from '@undb/authz'
import { RLS } from '../../entity/rls.js'
import { Table } from '../../entity/table.js'
import { View } from '../../entity/view.js'
import { RLSSqliteMapper } from './rls-sqlite.mapper.js'
import { RLSSqliteQueryVisitor } from './rls-sqlite.query-visitor.js'

export class RLSSqliteRepository implements IRLSRepository {
  constructor(private readonly em: EntityManager) {}

  async find(spec: RLSSpecification): Promise<RLSDO[]> {
    const qb = this.em.qb(RLS)

    const visitor = new RLSSqliteQueryVisitor(this.em, qb)
    spec.accept(visitor)

    const result = await qb.getResultList()

    return result.map((r) => RLSSqliteMapper.toDomain(r))
  }
  async insert(rls: RLSDO): Promise<void> {
    const table = this.em.getReference(Table, rls.tableId.value)
    const view = this.em.getReference(View, rls.viewId.value)
    const entity = new RLS(table, view, rls)
    await this.em.persistAndFlush(entity)
  }
}
